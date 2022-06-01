import { Injectable } from '@angular/core';
import { CommonService } from '@services/common.service';
import { SignalrService } from '@services/signalr.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationManagementService extends CommonService {


  constructor(public override signalr: SignalrService) {
    super(signalr)
   }


}
