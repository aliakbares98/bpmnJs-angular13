import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { SignalrService } from '@core/services/signalr.service';
import { first, map, skipWhile, switchMap, tap } from 'rxjs/operators';
import {  ContractWithActionType,  ContractWithUserAction,  ObjKeyStr,} from '@interfaces/global.interfaces';
import { toResponseProduct } from '@sharedMod/methods/toResponseProduct';
import { toColumnKeys } from '@sharedMod/methods/toColumnKeys';

@Injectable({
  providedIn: 'any',
})
export class CommonService {
  public modelSet: ObjKeyStr = {};
  public reportSpModel!: string;
  public dfContract = {};
  private withLoad = false;
  constructor(public signalr: SignalrService) { }

  /*
      Insert Form data
   */
  add(param: ContractWithActionType) {
    return this.signalr.postHttp(param);
  }

  delete(data: any) {
    const deletContract = {
      ActionType: 'DeleteN',
      Data: [...data],
    };

    //   return this.signalr.postGetData(deletContract);
    return this.signalr.postHttp(deletContract);
  }

  /*
     get Full data fore edit and show
  */
  report(id: number) {
    const contract = {
      ActionType: 'Load',
      Data: [
        {
          Model: this.reportSpModel,
          Criteria: null,
          Report_Data: [
            {
              Id: id,
            },
          ],
        },
      ],
    };

    return this.signalr.postGetData(contract);
  }

  /* 
    search by txt & filter
  */
  search(reportData: any) {
    const contract = {
      ActionType: 'Load',
      Data: [
        {
          Model: this.reportSpModel,
          Criteria: null,
          Report_Data: [{ ...reportData }],
        },
      ],
    };

    return this.signalr.postGetData(contract);
  }

  validation() {
    return this.signalr.getValidation();
  }
  /*
     get validation for dynamic form
  */
  getDFValidation() {
    return this.signalr.getDfValidation(this.dfContract);
  }

  /*
    dynamic form user decision
  */
  postUserAction(param: ContractWithUserAction) {
    return this.signalr.postHttp(param);
  }

  /*
    get user comments by id
  */
  getComments(id: number) {
    const contract = {
      ActionType: 'Load',
      ApiKey: 'DynFormShow',
      FormTag: 'formWfp_DynamicForms',
      Data: [
        {
          Model: 'spWfp_Rpt_WorkFlowProcessStatusValues',
          Criteria: null,
          Report_Data: [
            {
              Id: id,
            },
          ],
        },
      ],
    };

    return this.signalr.postGetData(contract);
  }

  /*
    dynamically check duplicate input
  */
  checkDuplicate(value: any, model: string) {
    const contract = {
      ActionType: 'LoadN',
      Data: [
        {
          Model: model,
          Criteria: null,
          Report_Data: [
            {
              Value: value,
            },
          ],
        },
      ],
    };

    return this.signalr.postGetData(contract);
  }

  getDynProducts(txt: string) {
    const criteria = `Name Like '%${txt}%' OR Code Like '%${txt}%'`;
    const contract = this.loadContractWithSingleObj(criteria, 'InvProductId');

    return this.signalr.postGetData(contract)?.pipe(toResponseProduct());
  }

  resolveValidation() {
    this.withLoad = false;
    return this.validation()?.pipe(
      tap((res) => {
        res.forEach((el:any) => {
          if (el.DataSourceObjectName) {
            this.withLoad = true;
          }
        });
      }),
      switchMap(async (res: any) => {
        if (this.withLoad) {
          const combolod = await this.getLoadByApiKey();
          return { validation: res, load: combolod };
        } else {
          return { validation: res };
        }
      })
    );
  }

  protected getLoadByApiKey() {
    const apiKey = this.signalr?.formNameAndApiKey?.ApiKey;
    if (apiKey) {
      return this.signalr.contractSourceChanged$
        .pipe(
          this.signalr.signalrPipe(apiKey),
          map((resp: any) => {
            if (resp && resp.ActionType === 'Load') {
              return resp.Data;
            }
          }),
          skipWhile((v) => v === undefined),
          first()
        )
        .toPromise();
    }

    return of(null);
  }

  protected loadContractWithSingleObj(criteria: any, dataSource:any) {
    let Data: any = [];
    let contract = {
      ActionType: 'LoadN',
      Data: Data,
    };

    const contractObj = this.makeContractObjBy(criteria, dataSource);
    contract.Data.push(contractObj);

    return contract;
  }

  protected makeContractObjBy(criteria: any, dataSource:any) {
    let contractObj = {
      Model: this.signalr.dataSourceObjectSet[dataSource],
      Criteria: criteria,
    };

    const contractKeys = toColumnKeys(this.signalr.validationSet, dataSource);
    contractObj = { ...contractObj, ...contractKeys };

    return contractObj;
  }
}
