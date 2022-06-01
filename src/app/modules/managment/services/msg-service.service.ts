import { Injectable } from '@angular/core';
import { CommonService } from '@core/services/common.service';
import { SignalrService } from '@core/services/signalr.service';

@Injectable({
  providedIn: 'root'
})
export class MsgService extends CommonService {

  // override reportSpModel!:string;

  constructor(public override signalr: SignalrService) {
    super(signalr)
   }
} 