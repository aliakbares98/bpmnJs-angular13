import { Router } from '@angular/router';
import { ListClass } from '@classes/list.class';
import { Component, OnInit } from '@angular/core';
import { EventBusService } from '@core/services/event-bus.service';
import { MsgService } from '../../services/msg-service.service';


@Component({
  selector: 'app-msg-search',
  templateUrl: '../../../../_html/list.component.html',
  styleUrls: ['../../../../_scss/cur/list.scss']
})
export class MsgSearchComponent extends ListClass implements OnInit {

  constructor(
    // public service: SupplierService,
    public override service: MsgService,
    public override router: Router,
    eb: EventBusService,
  ) {
    super(eb);
  }

  override async ngOnInit() {
    super.ngOnInit();
  }


}
