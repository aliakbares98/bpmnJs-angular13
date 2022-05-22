import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { map, tap, first, } from 'rxjs/operators';
import { TokenInfo, Login } from './auth.interfaces';
import { Injectable, Renderer2 } from '@angular/core';
import { AccessParam } from '@interfaces/global.interfaces';
import { SignalrService } from '@core/services/signalr.service';
import { MenuList, SubMenu } from '@core/header/header.interfaces';
import { JwtHelperService } from '@auth0/angular-jwt';
import { clearStorage } from '@sharedMod/methods/clearStorage';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenInfo!: TokenInfo;
  private server: string = environment.endPoints.server;
  private tokenExpirationTimer: any;
  private listenTime = 300000;
  private museMoved = false;
  private keyPressed = false;
  private reAutorizeTryNumber = 0;

  public permissions!: Array<string>;
  public permissionSet: { [key: string]: AccessParam[] } = {};

  constructor(
    public signalr: SignalrService,
    private router: Router /*    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document */
  ) {
    /*     this.renderer = rendererFactory.createRenderer(null, null);
    this.renderer.listen('document', 'mousemove', (e) => {
      this.museMoved = true;
    });
    this.renderer.listen('document', 'keyup', (e) => {
      this.keyPressed = true;
    }); */
    this.reInitAuth();
  }

  login(data: Login) {
    return this.signalr.post(data, 'user.login')?.pipe(
      map((response: any) => {
        const body = response.body;
        if (body && body.token) {
          localStorage.setItem('hermes_token', body.token);
          const expirationDuration = this.expirationDuration;
          this.setReAutorizeTimer(expirationDuration);

          return true;
        }
        return false;
      })
    );
  }

  logout() {
    const contract = {
      ...this.signalr.baseContract,
      ApiKey: 'Logout',
      ActionType: 'InsertN',
      Data: [{ Model: 'Logout', Criteria: null }],
      FormTag: 'Logout',
    };

    return this.signalr.postHttp(contract);
  }

  getGeneralMessage() {
    const contract = {
      ...this.signalr.baseContract,
      ApiKey: 'Message',
      ActionType: 'LoadN',
      Data: [{ Model: 'Message', Criteria: null }],
      FormTag: 'Generalmessage',
    };

    return this.signalr.postHttp(contract);
  }

  /**
   * @usage : control functions
   */

  get isLoggedIn() {
    const jwtHelper = new JwtHelperService();
    const token = localStorage.getItem('hermes_token');

    if (!token) {
      return false;
    }

    const isExpired = jwtHelper.isTokenExpired(token);
    return !isExpired;
  }

  loadToken() {
    const token = localStorage.getItem('hermes_token') || '';
    const jwtHelper = new JwtHelperService();
    this.tokenInfo = jwtHelper.decodeToken(token);
  }

  get tokenExpirationDate() {
    this.loadToken();
    const tokenExpirationDate = this.tokenInfo.exp;
    return tokenExpirationDate;
  }

  setReAutorizeTimer(expirationDuration: number) {
    // console.log(expirationDuration / 60000);

    this.tokenExpirationTimer = setTimeout(() => {
      this.museMoved = false;
      this.keyPressed = false;
      let waitingForUserActionTimer: any = setInterval(() => {
        this.listenTime -= 1000;

        /*          (this.listenTime < 300000 && this.museMoved) ||
           (this.listenTime < 300000 && this.keyPressed); */

        if (this.listenTime < 300000) {
          this.listenTime = 300000;
          clearInterval(waitingForUserActionTimer);
          waitingForUserActionTimer = null;
          this.reAutorize();
        } else if (this.listenTime <= 0) {
          clearInterval(waitingForUserActionTimer);
          waitingForUserActionTimer = null;
          this.logout();
        }
      }, 1000);
    }, expirationDuration);
  }

  reAutorize() {
    clearTimeout(this.tokenExpirationTimer);
    this.tokenExpirationTimer = null;
    const payload = { Token: this.signalr.token };

    this.signalr
      .reAutorize(payload, 'authorize')
      .pipe(
        map((token: any) => {
          if (token) {
            localStorage.setItem('hermes_token', token);
            this.signalr.connectionParam.token = token;
            return true;
          }
          return false;
        }),
        tap((res) => {
          if (res) {
            const expirationDuration = this.expirationDuration;
            this.setReAutorizeTimer(expirationDuration);
            //alert('reAutorized');
          } else {
            if (this.reAutorizeTryNumber > 2) {
              console.log('reAutorizeTryNumber is mor than 2');
              this.redirectToLogin();
            } else {
              this.reAutorize();
              this.reAutorizeTryNumber = this.reAutorizeTryNumber + 1;
            }
          }
          // alert('token has been reautorized!');
        }),
        first()
      )
      .subscribe();
  }

  get expirationDuration() {
    const date = new Date().getTime();
    const retedTime = Math.floor(date / 1000) + 300;
    const exp = (this.tokenExpirationDate - retedTime) * 1000;

    return exp;
  }

  hasPermission(path: string, id: string) {
    if (!this.permissions) {
      this.initAccessLinks();
    }

    const permissions = [...this.permissions];
    path = path.replace('/', '');

    const hasPerpission = permissions.find((url: string) => {
      if (id) url = url.replace(':Id', id);
      return url === path;
    });

    if (hasPerpission) {
      return true;
    }

    return false;
  }

  initAccessLinks() {
    const localmenu = localStorage.getItem('hermes_menu');
    if (localmenu) {
      const menu = JSON.parse(localmenu);
      const accessList = menu.reduce(
        (acc: Array<string>, current: MenuList) => {
          let accList: string[] = [];
          current.SubMenu.filter((el: SubMenu) => el?.AccessLink !== null).map(
            (el: SubMenu) => {
              accList = [...accList, ...el?.AccessLink];
            }
          );

          acc = [...acc, ...accList];
          return acc;
        },
        []
      );

      this.permissions = accessList;
    }
  }
  initPermissions() {
    const localmenu = localStorage.getItem('hermes_menu');
    if (localmenu) {
      const menu = JSON.parse(localmenu);
      menu.forEach((current: MenuList) => {
        let accList: any = current.SubMenu.filter(
          (el: any) => el?.AccessLink !== null
        ).reduce((res: any, cur: SubMenu) => {
          const addItem = {
            ApiKey: cur.ApiKey,
            WorkFlowIconName: cur.WorkFlowIconName,
            WorkFlowFormName: cur.WorkFlowFormName,
            WorkFlowTypeCommand: cur.WorkFlowTypeCommand,
            AccessLink: cur.AccessLink,
          };
          if (res[cur.SearchApiKey]) {
            res[cur.SearchApiKey] = [...res[cur.SearchApiKey], addItem];
          } else {
            res[cur.SearchApiKey] = [addItem];
          }

          return res;
        }, []);
        this.permissionSet = { ...this.permissionSet, ...accList };
      });
      localStorage.setItem(
        'hermes_permissionSet',
        JSON.stringify(this.permissionSet)
      );
    }
  }

  resetTimer() {
    if (!this.signalr.signalrConnected) {
      this.signalr.startValueChanged$
        .pipe(
          tap((data) => {
            if (data) {
              if (this.expirationDuration > 0) {
                this.setReAutorizeTimer(this.expirationDuration);
              } else if (
                this.expirationDuration <= 0 ||
                this.expirationDuration > -300
              ) {
                this.reAutorize();
              } else {
                this.redirectToLogin();
              }
            }
            return data;
          }),
          first()
        )
        .subscribe();
    } else {
      this.setReAutorizeTimer(this.expirationDuration);
    }
  }

  reInitAuth() {
    if (this.router.url !== '/login') {
      if (this.isLoggedIn) {
        this.resetTimer();
      } else {
        console.log('app is not logged In');

        this.redirectToLogin();
      }
    }
  }

  redirectToLogin() {
    this.router.navigate(['/login']).then(() => {
      this.signalr.stop();
      clearStorage();
      window.location.reload();
    });
  }

  /*   get avatar(){

    if (!this.tokenInfo)
      this.loadToken();
    let avatar =  `${this.server}/${this.tokenInfo.avatar} `;
    return avatar;

  }
*/
}
