import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ListClass } from './../../../../shared/classes/list.class';
import { EventBusService } from './../../../../core/services/event-bus.service';
import { OrganizationManagementService } from './../../service/organization-management.service';


@Component({
  selector: 'app-add-process-information',
  templateUrl: './add-process-information.component.html',
  styleUrls: ['./add-process-information.component.scss']

})


export class AddProcessInformationComponent extends ListClass implements OnInit {

  constructor(
    public override service: OrganizationManagementService,
    public override router: Router,
    eb: EventBusService
  ) {
    super(eb)
  }

  public statusList: Array<string> = [];
  public override showList: any;


  override async ngOnInit() {
    super.ngOnInit();
  }

}
