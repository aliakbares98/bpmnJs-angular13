import { EventBusService } from './../../../core/services/event-bus.service';
import { Router } from '@angular/router';
import { OrganizationManagementService } from './../service/organization-management.service';
import { ListClass } from './../../../shared/classes/list.class';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-organization-management',
  templateUrl: '../../../_html/list.component.html',
  styleUrls: ['../../../_scss/cur/list.scss']
})
export class OrganizationManagementComponent extends ListClass implements OnInit {

  constructor(
    public override service: OrganizationManagementService,
    public override router: Router,
    eb: EventBusService
  ) {
    super(eb)
  }

  override async ngOnInit() {
    super.ngOnInit();
  }

}
