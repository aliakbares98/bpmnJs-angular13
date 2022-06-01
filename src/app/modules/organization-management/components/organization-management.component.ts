import { Router } from '@angular/router';
import { ListClass } from '@classes/list.class';
import { Component, OnInit } from '@angular/core';
import { EventBusService } from '@services/event-bus.service';
import { OrganizationManagementService } from './../service/organization-management.service';


@Component({
  selector: 'app-organization-management',
  templateUrl: '../../../_html/list.component.html',
  styleUrls: ['../../../_scss/cur/list.scss']
})
export class OrganizationManagementComponent extends ListClass implements OnInit {

  constructor(
    public override service: OrganizationManagementService,
    public override router: Router,
    eb: EventBusService,
  ) {
    super(eb)
  }

  public statusList: Array<string> = [];
  public override  showList: any;

  
  override async ngOnInit() {
    super.ngOnInit();
  }

}
