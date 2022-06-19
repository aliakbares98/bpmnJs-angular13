
import * as uuid from 'uuid';
import { environment } from '@env/environment';
import {  Injectable } from '@angular/core';
import { saveAs as importedSaveAs } from 'file-saver';
import { Router, NavigationEnd } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifyList } from '@core/header/header.interfaces';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';
import { EmitEvent, EventBusService, Events } from './event-bus.service';
import { switchMap, map, first, tap, last, filter, skipWhile, catchError, } from 'rxjs/operators';
import { throwError, TimeoutError, pipe, of, Subscription, Subject, BehaviorSubject, } from 'rxjs';
import { HttpClient, HttpHeaders, HttpEventType, HttpRequest, HttpErrorResponse, } from '@angular/common/http';
import { AppTimeoutError } from '@errors/timeout-error';
import { AppError } from '@errors/app-error';
import { ForbiddenError } from '@errors/forbidden-error';
import { ConflictError } from '@errors/conflic-request-error';
import { NotFoundError } from '@errors/not-found-error';
import { BadRequestError } from '@errors/bad-request-error';
import { b64toBlob } from '@sharedMod/methods/base64ToBlob';
import { Contract, KeyStr, ValidationSet } from '@interfaces/global.interfaces';


@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  public connection!: HubConnection;
  public signalrConnected = false;

  private contractSource$ = new BehaviorSubject<Contract[]>([]);
  contractSourceChanged$ = this.contractSource$.asObservable();

  /* Contract Proprteis */
  public contractIdsSubject$ = new BehaviorSubject<any>(null);
  public formNameAndApiKeySubject$ = new BehaviorSubject<any>(null);
  public formActionSubject$ = new BehaviorSubject<any>('');

  public start$ = new Subject<any>();
  startValueChanged$ = this.start$.asObservable();

  public _status: any;
  private _method!: string;
  private endPoint: any = environment.endPoints;
  protected url!: string;
  private _progress = 0;

  public connectionParam: {
    token: string | null;
    connectionId: string | null;
  } = {
      token: null,
      connectionId: null,
    };

  protected headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  public notifyList: NotifyList[] = [];
  public notifyCount!: number;
  public cartableCount!: number;
  public validationSet!: ValidationSet[];
  public dataSourceObjectSet: KeyStr = {};
  public grabage: Subscription = new Subscription();
  constructor(
    private http: HttpClient,
    private router: Router,
    private eventBus: EventBusService,
    private _snackBar: MatSnackBar // private auth: AuthService
  ) {
    if (this.router.url !== '/login') {
      this.reStart();
      this.removeContractIds();
    }
  }

  createConnection() {
    this.connectionParam.token = this.token;
    this.setEndPoint('hub');
    this.connection = new HubConnectionBuilder()
      .withUrl(this.url, {
        accessTokenFactory: () => JSON.stringify(this.connectionParam),
      })
      .withAutomaticReconnect()
      .build();
    // this.connection.serverTimeoutInMilliseconds = 300000;
    // this.connection.keepAliveIntervalInMilliseconds = 60000;

    this.connectionEvents();
  }
  receive() {
    this.connection.on('ReceiveMessage', (data) => {
      const contract = JSON.parse(data);
      console.log(contract);
      

      const type = contract.ActionType;
      const apiKey = contract.ApiKey;

      if (
        type.charAt(type.length - 1) !== 'N' ||
        type !== 'Next' ||
        apiKey === 'NotifDel'
      ) {
        this.setOverlayResponse(type);
        this.addContract(contract);
        this.setNotifAndCartableLoad(contract);
      }
    });
  }

  start() {
    return new Promise((resolve, reject) => {
      this.createConnection();
      this.connection
        .start()
        .then(() => {
          this.receive();
          this.signalrConnected = true;
          this.connectionParam.connectionId = this.connection.connectionId;
          if (!this.connection.connectionId) {
            window.location.reload();
          }

          resolve(true);
        })

        .catch((err) => {
          reject(false);
        });
    });
  }

  stop() {
    return new Promise((resolve, reject) => {
      this.connection
        .stop()
        .then(() => {

          this.signalrConnected = false;
          resolve(true);
        })

        .catch((err) => {
          reject(false);
          console.log('Error while stopting connection: ' + err);
        });
    });
  }

  async reStart() {
    const start = await this.start();
    this.start$.next(start);
  }

  connectionEvents() {
    this.connection.onreconnecting(() => {
      console.log('onreconnecting');
      this.start();
    });
    this.connection.onreconnected(() => {
      console.log('onreconnected', this.connection.connectionId);
      this.connectionParam.connectionId = this.connection.connectionId;
      if (!this.connection.connectionId) {
        window.location.reload();
      }
    });
    this.connection.onclose((event) => {
      console.log('onclose', event);
      const self = this;
      // setTimeout(function () {
      //   self.start();
      // }, 5000);
    });
  }

  /* ......................................... */

  getContracts(): Contract[] {
    return this.contractSource$.getValue();
  }

  private setContracts(contracts: Contract[]): void {
    this.contractSource$.next(contracts);
  }

  addContract(contract: Contract): void {
    const preContracts = this.getContracts().filter(
      (c) => c.ApiKey !== contract.ApiKey
    );
    
    const newContracts = [...preContracts, contract];
    this.setContracts(newContracts);
  }

  removeContractByRequestId(requestId: string) {
    const contracts = this.getContracts().filter(
      (c) => c.RequestId !== requestId
    );

    this.setContracts(contracts);
  }
  removeContractByApiKey(apiKey: string) {
    const contracts = this.getContracts().filter((c) => c.ApiKey !== apiKey);

    this.setContracts(contracts);
  }

  /* ..............Signalr Post ............ */

  getDataRq(contract: Contract) {
    let rqContract = {
      ...contract,
      ConnectionId: this.connection.connectionId,
      RequestId: uuid.v4(),
    };

    if (
      rqContract.ApiKey &&
      !rqContract.FormTag &&
      this.formNameAndApiKey.FormTag
    ) {
      rqContract = {
        ...rqContract,
        ...{ FormTag: this.formNameAndApiKey.FormTag },
      };
    } else if (!rqContract.ApiKey && !rqContract.FormTag) {
      if (this.formNameAndApiKey.ApiKey && this.formNameAndApiKey.FormTag) {
        rqContract = {
          ...rqContract,
          ...this.formNameAndApiKey,
        };
      }
    }
    //-- console.log('contract', rqContract);

    if (
      this.contractIds.CurrentProcessStatusId &&
      this.contractIds.WorkflowProcessId &&
      rqContract.ApiKey &&
      rqContract.ApiKey !== 'NotifInitial' &&
      rqContract.ApiKey !== 'CartableInitial' &&
      rqContract.ApiKey !== 'DynFormShow' &&
      !rqContract.ApiKey.includes('Srch')
    ) {
      rqContract = {
        ...rqContract,
        ...this.contractIds,
      };
    }

    if (rqContract.ApiKey) {
      return this.post(rqContract)?.pipe(
        this.pipeFirst(rqContract.RequestId),
        this.toResponseBody()
      );

    }
    return;

  }
  getContractRq(contract: Contract) {
    let rqContract = {
      ...contract,
      ConnectionId: this.connection.connectionId,
      RequestId: uuid.v4(),
    };

    if (
      rqContract.ApiKey &&
      !rqContract.FormTag &&
      this.formNameAndApiKey.FormTag
    ) {
      rqContract = {
        ...rqContract,
        ...{ FormTag: this.formNameAndApiKey.FormTag },
      };
    } else if (!rqContract.ApiKey && !rqContract.FormTag) {
      if (this.formNameAndApiKey.ApiKey && this.formNameAndApiKey.FormTag) {
        rqContract = {
          ...rqContract,
          ...this.formNameAndApiKey,
        };
      }
    }

    if (
      this.contractIds.CurrentProcessStatusId &&
      this.contractIds.WorkflowProcessId &&
      rqContract.ApiKey !== 'NotifDel'
    ) {
      rqContract = {
        ...rqContract,
        ...this.contractIds,
      };
    }

    if (rqContract.ApiKey) {
      return this.post(rqContract)?.pipe(
        this.pipeFirst(rqContract.RequestId),
        this.toResponseTap()
      );
    }
    return;
  }
  httpRq(contract: Contract) {
    let rqContract = {
      ...contract,
      ConnectionId: this.connection.connectionId,
      RequestId: uuid.v4(),
    };

    if (
      rqContract.ApiKey &&
      !rqContract.FormTag &&
      this.formNameAndApiKey.FormTag
    ) {
      rqContract = {
        ...rqContract,
        ...{ FormTag: this.formNameAndApiKey.FormTag },
      };
    } else if (
      !rqContract.ApiKey &&
      rqContract.FormTag &&
      this.formNameAndApiKey.ApiKey
    ) {
      rqContract = {
        ...rqContract,
        ...{ ApiKey: this.formNameAndApiKey.ApiKey },
      };
    } else if (!rqContract.ApiKey && !rqContract.FormTag) {
      if (this.formNameAndApiKey.ApiKey && this.formNameAndApiKey.FormTag) {
        rqContract = {
          ...rqContract,
          ...this.formNameAndApiKey,
        };
      }
    }

    if (
      this.contractIds.CurrentProcessStatusId &&
      this.contractIds.WorkflowProcessId
    ) {
      rqContract = {
        ...rqContract,
        ...this.contractIds,
      };
    }

    return this.post(rqContract)?.pipe(
      map((response: any) => {
        const data = response.body.data;

        if (data) {
          return data;
        }

        return response;
      }),
      this.toHttpResponse()
    );
  }

  /* Request which returns pure data */
  postGetData(param: Contract) {
    let contract = {
      ...this.baseContract,
      ...param,
      UserId: this.token,
    };

    if (!this.signalrConnected) {
      this.setContractIds(contract.ActionType || '');
      this.setApiKeyAndFormName();
      return this.startValueChanged$.pipe(
        switchMap((data) => {
          //if (data) {
          return this.getDataRq(contract) || of(null);
          //}
        }),
        first()
      );
    }
    return this.getDataRq(contract);
  }

  /* Request which returns all contract */
  postGetContract(param: Contract) {
    let contract = {
      ...this.baseContract,
      ...param,
      UserId: this.token,
    };

    if (!this.signalrConnected) {
      this.setContractIds(contract.ActionType || '');
      this.setApiKeyAndFormName();
      return this.startValueChanged$.pipe(
        switchMap((data) => {
          //  if (data) {
          return this.getContractRq(contract) || of(null);
          //}
        }),
        first()
      );
    }

    return this.getContractRq(contract);
  }

  /* just Https Request */
  postHttp(param: Contract) {
    let contract = {
      ...this.baseContract,
      ...param,
      UserId: this.token,
    };

    if (!this.signalrConnected) {
      this.setContractIds(contract.ActionType || '');
      this.setApiKeyAndFormName();
      return this.startValueChanged$.pipe(
        switchMap((data) => {
          //  if (data) {
          return this.httpRq(contract);
          // }
        }),
        first()
      );
    }

    return this.httpRq(contract);
  }

  reAutorize(param: any, url: string) {
    let contract = {
      ...param,
      ConnectionId: this.connection.connectionId,
      RequestId: uuid.v4(),
    };

    return this.post(contract, url)?.pipe(
      map((response: any) => {
        const data = response.body.token;

        if (data) {
          return data;
        }

        return null;
      }),
      this.toHttpResponse()
    );
  }
  /* ................. Pipe Section ............*/

  /* pipe First by requestId */
  pipeFirst(requestId: string) {
    return pipe(
      switchMap((_) => {
        return this.contractSourceChanged$;
      }),

      map((resp) => {
        return resp.filter((c) => {
          return c.RequestId === requestId;
        })[0];
      }),
      skipWhile((v) => v === undefined),
      first(),
      tap((res) => {
        if (res.RequestId) {
          //console.log('pipeFirst Before', this.getContracts());
          this.removeContractByRequestId(res.RequestId);
          // console.log('pipeFirst After', this.getContracts());
          this.status = res;
        }
      })
    );
  }

  /* pipe First by apikey */
  pipeByApiKey(apiKey: string) {
    return pipe(
      switchMap((_) => {
        return this.contractSourceChanged$;
      }),

      map((resp) => {
        return resp.filter((c) => {
          return c.ApiKey === apiKey;
        })[0];
      }),
      skipWhile((v) => v === undefined),
      first(),
      tap((res) => {
        if (res.ApiKey) {
          //  console.log('pipeByApiKey Before', this.getContracts());
          this.removeContractByApiKey(res.ApiKey);
          //console.log('pipeByApiKey After', this.getContracts());
          this.status = res;
        }
      })
    );
  }

  toSignalr() {
    return pipe(
      switchMap((_) => {
        return this.contractSourceChanged$;
      })
    );
  }

  signalrPipe(apiKey: string) {
    return pipe(
      map((resp: any) => {
        return resp.filter((c: any) => c.ApiKey === apiKey)[0];
      }),
      skipWhile((v) => v === undefined),
      tap((res) => {
        if (res && res['ApiKey'] !== 'undefined') {
          //console.log('signalrPipe Before', this.getContracts());
          this.removeContractByApiKey(res.ApiKey);
          //console.log('signalrPipe After', this.getContracts());
          this.status = res;
        }
      })
    );
  }

  openSnackBar(param: any) {
    const message = param.message;
    const action = param.action ? param.action : '';
    const duration = param.duration ? param.duration * 1000 : 3000;
    const hPosition = param.hPosition ? param.hPosition : 'right';
    const vPosition = param.vPosition ? param.vPosition : 'top';
    const panelClass = param.panelClass ? param.panelClass : [];
    this._snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: hPosition,
      verticalPosition: vPosition,
      panelClass: panelClass,
    });
  }

  /* ......... Base Service Method ..........*/
  setEndPoint(url: string, params?: any) {
    const configEndPoint = this.baseUrl;
    const server = configEndPoint.server;
    const apiVersion = configEndPoint.api;
    if (url.length > 0) {
      const parts = url.split('.');

      switch (parts.length) {
        case 1:
          this.url = server + apiVersion + this.endPoint[url];
          break;

        case 2:
          this.url = server + apiVersion + this.endPoint[parts[0]][parts[1]];
          break;

        case 3:
          this.url =
            server + apiVersion + this.endPoint[parts[0]][parts[1]][parts[2]];
          break;
      }

      if (params) {
        this.url = this.addDynamics(this.url, params);
      }
    }
  }
  private get baseUrl() {
    const hermesEndPoints = localStorage.getItem('hermes_endPoints');
    if (hermesEndPoints) {
      return JSON.parse(hermesEndPoints);
    } else {
      return this.endPoint;
    }
  }
  addDynamics(url: string, params: any) {
    let urlParts = url.split('/');

    urlParts = urlParts.map((value: string, idx: number) => {
      if (value.charAt(0) === ':') {
        const key = value.substring(1);
        value = params[key];
      }
      return value;
    });

    return urlParts.join('/');
  }

  post(resource: any, url = 'recieve') {
    this.setEndPoint(url);

    return this.http
      .post(this.url, resource, {
        observe: 'events',
        reportProgress: true,
      })
      .pipe(
        tap((event) => {
          this.status = event;
        }),
        last(),
        catchError(this.handleError)
      );
  }

  upload(payload: any) {
    this._method = 'upload';
    this._progress = 0;
    let header = new HttpHeaders();
    header = header.set('Authorization', 'Bearer ' + this.token);
    header = header.set('ConnectionId', this.connection.connectionId || '');

    const req = new HttpRequest('POST', this.url, payload, {
      headers: header,
      reportProgress: true,
    });
    return this.http
      .request(req)
      .pipe(
        tap((event) => {
          this.status = event;
        }),
        last(),
        catchError(this.handleError)
      )
      .pipe(
        map((response: any) => {
          const body = response.body;
          if (body) {
            return body;
          }

          return null;
        })
      );
  }

  download(resource: any, fileName = 'sample.jpg') {
    return this.http
      .post(this.url, resource, {
        headers: this.headers,
        observe: 'events',
        reportProgress: true,
      })
      .pipe(
        tap((event) => {
          this.status = event;
        }),
        last(),
        catchError(this.handleError)
      )
      .subscribe((event: any) => {
        if (event.type === HttpEventType.Response) {
          const body = event.body;
          if (body) {
            const result = body['data'][0];
            const blob = b64toBlob(result.FileByte, result.Type);
            importedSaveAs(blob, result.Name);
          }
        }
      });
  }

  handleError = (error: HttpErrorResponse) => {
    console.log('error', error);

    this.openSnackBar({
      message: error.error.message,
      action: 'بستن',
      duration: 6,
      panelClass: ['snackbar-error'],
    });

    if (error.status === 400) {
      return throwError(new BadRequestError(error));
    }
    if (error.status === 404) {
      return throwError(new NotFoundError(error));
    }
    if (error.status === 403) {
      return throwError(new ForbiddenError(error));
    }

    if (error.status === 409) {
      return throwError(new ConflictError(error));
    }

    if (error instanceof TimeoutError) {
      return throwError(new AppTimeoutError(error));
    }

    return throwError(new AppError(error));
  };

  set status(message) {
    if (typeof message.type !== 'undefined') {
      switch (message.type) {
        case 0:
          this._status = 'pending';
          break;

        case 1:
          this._status = 'pending';

          if (message.loaded && message.total) {
            this._progress = Math.round((message.loaded / message.total) * 100);
            if (this._progress > 100) {
              this._progress = 100;
            }
          }

          break;

        case 3:
          this._status = 'error';
          break;

        case 4:
          this._status = 'registered';

          break;
      }
    } else {
      switch (message.Status) {
        case '9999':
          this._status = 'error';
          this.reStatus();
          this.openSnackBar({
            message: message.Message,
            action: 'بستن',
            duration: 6,
            panelClass: ['snackbar-error'],
          });
          /*       if (message.Message.includes(262)) { ///---09-18-2021
            this.router.navigate(['/dashboard']);
          } */
          /*           throw throwError({
            status: message.Status,
            message: message.Message,
          }); */
          /*           throw new SignalrError({
            status: message.Status,
            message: message.Message,
          }); */
          break;
        case '10000':
          this._status = 'done';
          this.reStatus();
          break;
        default:
          this._status = 'sleep';
          break;
      }
    }
  }

  get status() {
    return this._status;
  }

  get progress() {
    return this._progress;
  }

  get method() {
    return this._method;
  }

  reStatus() {
    setTimeout(() => {
      if (this._status === 'done' || this._status === 'error') {
        this._status = 'sleep';
      }
    }, 500);
  }

  get token() {
    return localStorage.getItem('hermes_token') || '';
  }

  get baseContract() {
    const baseContact = {
      UserId: this.token,
      WorkflowProcessId: null,
      CurrentProcessStatusId: null,
      Status: null,
      Message: null,
      WfpActionObjects: null,
    };
    return baseContact;
  }

  toResponseBody() {
    return pipe(
      tap((event: any) => {
        if (event) {
          this.status = event;
        }
      }),
      map((resp: any) => {
        if (resp) {
          return resp.Data;
        }
      })
    );
  }
  toResponseTap() {
    return pipe(
      tap((event: any) => {
        if (event) {
          this.status = event;
        }
      })
    );
  }
  toHttpResponse() {
    return pipe(
      tap((_) => {
        if (this._status === 'registered') {
          this._status = 'done';
        }
      })
    );
  }

  get contractIds() {
    const ids = this.contractIdsSubject$.getValue();

    return {
      WorkflowProcessId: ids?.WorkflowProcessId,
      CurrentProcessStatusId: ids?.CurrentProcessStatusId,
    };
  }
  get formNameAndApiKey() {
    const keys = this.formNameAndApiKeySubject$.getValue();

    return {
      ApiKey: keys?.ApiKey,
      FormTag: keys?.FormTag,
    };
  }
  get formAction() {
    return this.formActionSubject$.getValue();
  }

  getValidation() {
    let apiKey = this.formNameAndApiKey?.ApiKey;
    let formAction = this.formAction;

    if (!apiKey) {
      apiKey = sessionStorage.getItem(`hermes_ApiKey`);
    }

    if (!formAction) {
      formAction = sessionStorage.getItem(`hermes_WorkFlowTypeCommand`);
    }
    let contract = {
      ApiKey: 'Validation',
      ActionType: 'Load',
      Data: [
        {
          Model: 'tblCore_ObjectCollections',
          Criteria: null,
          ApiKey: apiKey,
          ActionType: formAction,
        },
      ],
    };

    return this.postHttp(contract).pipe(
      tap((data: any) => {
        this.validationSet = data;
      })
    );
  }

  getDfValidation(param: any = {}) {
    let apiKey = this.formNameAndApiKey?.ApiKey;
    let formAction = this.formAction;

    if (!apiKey) {
      apiKey = sessionStorage.getItem(`hermes_ApiKey`);
    }

    if (!formAction) {
      formAction = sessionStorage.getItem(`hermes_WorkFlowTypeCommand`);
    }
    const contract = {
      ...param,
      ApiKey: 'Validation',
      ActionType: 'Load',
      Data: [
        {
          Model: 'tblCore_ObjectCollections',
          ApiKey: apiKey,
          ActionType: formAction,
          Criteria: null,
        },
      ],
    };

    return this.postHttp(contract);
  }

  /*
  set contract ids after page reloaded */
  setContractIds(actionType: string) {
    const urlSet = this.router.url.split('/');
    if (urlSet[urlSet.length - 1] === 'New' && actionType === 'Insert') {
      sessionStorage.removeItem('hermes_cpsId');
      sessionStorage.removeItem('hermes_wpId');
      this.contractIdsSubject$.next({
        CurrentProcessStatusId: null,
        WorkflowProcessId: null,
      });
    } else {
      const cpsId = sessionStorage.getItem('hermes_cpsId');
      const wpId = sessionStorage.getItem('hermes_wpId');
      if (cpsId && wpId) {
        this.contractIdsSubject$.next({
          CurrentProcessStatusId: +cpsId,
          WorkflowProcessId: +wpId,
        });
      }
    }
  }
  setApiKeyAndFormName() {
    const apiKey = sessionStorage.getItem('hermes_ApiKey');
    const formName = sessionStorage.getItem('hermes_FormName');
    if (apiKey && formName) {
      this.formNameAndApiKeySubject$.next({
        ApiKey: apiKey,
        FormTag: formName,
      });
    }
  }

  removeContractIds() {
    this.grabage.add(
      this.router.events
        .pipe(
          filter((event) => event instanceof NavigationEnd),
          map((route: any) => {
            while (route.firstChild) {
              route = route.firstChild;
            }
            return route;
          }),
          map((route) => route.url),
          first()
        )
        .subscribe((url) => {
          const urlSet = url.split('/');

          if (urlSet[urlSet.length - 1] === 'New') {
            sessionStorage.removeItem('hermes_cpsId');
            sessionStorage.removeItem('hermes_wpId');
            this.contractIdsSubject$.next({
              CurrentProcessStatusId: null,
              WorkflowProcessId: null,
            });
          }
        })
    );
  }

  addNotify(data: NotifyList) {
    const snakBar = {
      message: data.CardboardSubject,
      action: 'بستن',
      panelClass: ['snackbar-notify'],
    };

    this.openSnackBar(snakBar);

    this.notifyList = [data, ...this.notifyList];
    this.notifyCount = this.notifyList.length;
  }

  setNotifAndCartableLoad(contract: Contract) {
    const apiKey = contract.ApiKey;
    if (apiKey === 'NotifLoad') {
      this.addNotify(contract.Data[0]);
      this.removeContractByApiKey('NotifLoad');
    }

  }


  setOverlayResponse(actionType: string) {
    if (actionType === 'Load') {
      this.eventBus.emit(new EmitEvent(Events.httpResponse));
    }
  }

  ngOnDestroy() {
    this.stop();
    this.grabage.unsubscribe();
    this.contractIdsSubject$.next(null);
    this.contractIdsSubject$.complete();

    this.formNameAndApiKeySubject$.next(null);
    this.formNameAndApiKeySubject$.complete();

    this.contractSource$.next([]);
    this.contractSource$.complete();

    this.start$.next(null);
    this.start$.complete();
  }
  /* Custom Error */

  /*   CustomException(message) {
    let error = new Error(message);

    error.status = 99999 ;
    return error;
  } */

  //CustomException.prototype = Object.create(Error.prototype);
}
