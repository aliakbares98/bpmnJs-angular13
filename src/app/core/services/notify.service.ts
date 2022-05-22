import { Injectable } from '@angular/core';

import { first } from 'rxjs/operators';

import { SignalrService } from './signalr.service';

@Injectable()
export class NotifyService {
  private contract = {
    ...this.signalr.baseContract,
    ActionType: 'LoadN',
    /*  Data: [{ Model: 'vwWfp_Cardboards_Notification', Criteria: null }], */
    Data: [
      {
        Model: 'spWfp_Rpt_Cardboards',
        Criteria: null,
        Report_Data: [
          {
            KeyId: -1,
          },
        ],
      },
    ],
    FormTag: 'formWfp_Notification',
  };

  constructor(public signalr: SignalrService) {}

  initNotify() {
    const contract = {
      ...this.contract,
      ApiKey: 'NotifInitial',
    };
    /*     if (!this.signalr.signalrConnected) {
      return this.signalr.startValueChanged$.pipe(
        switchMap((_) => {

          return this.getNotifyHttp(contract);
        })
      );
    } */

    return this.getNotifyHttp(contract);
  }

  deletNotifyBy(id: number) {
    const contract = {
      ApiKey: 'NotifDel',
      ActionType: 'DeleteN',
      Data: [{ Model: 'tblWfp_Cardboards', Criteria: null, KeyId: id }],
      FormTag: 'formWfp_Notification',
    };

    return this.signalr.postGetContract(contract)?.pipe(first());
  }

  deletAllNotity() {
    const contract = {
      ApiKey: 'NotifDel',
      ActionType: 'DeleteN',
      Data: [{ Model: 'tblWfp_Cardboards', Criteria: null, KeyId: -1 }],
      FormTag: 'formWfp_Notification',
    };

    return this.signalr.postGetContract(contract)?.pipe(first());
  }

  getNotifyHttp(contract: any) {
    return this.signalr.postGetData(contract)?.pipe(first());
  }
}
