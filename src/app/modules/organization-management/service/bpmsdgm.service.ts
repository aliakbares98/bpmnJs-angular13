import { Injectable } from '@angular/core';
import { CommonService } from '@services/common.service';
import { SignalrService } from '@core/services/signalr.service';


@Injectable({
  providedIn: 'root'
})
export class BmpsdgmService extends CommonService {


  constructor(public override signalr: SignalrService) {
    super(signalr)
   }


}
