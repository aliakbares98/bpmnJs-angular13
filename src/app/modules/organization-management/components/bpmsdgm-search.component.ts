import { Router } from '@angular/router';
import { ListClass } from '@classes/list.class';
import { Component, OnInit } from '@angular/core';
import { EventBusService } from '@core/services/event-bus.service';
import { BmpsdgmService } from '../service/bpmsdgm.service';


@Component({
  selector: 'app-bpmsdgm-search',
  templateUrl: '../../../_html/list.component.html',
  styleUrls: ['../../../_scss/cur/list.scss']
})
export class BpmsdgmSearchComponent extends ListClass implements OnInit {

  constructor(
    public override service: BmpsdgmService,
    public override router: Router,
    eb: EventBusService,
  ) {
    super(eb)
  }


  override async ngOnInit() {
    super.ngOnInit();
  }

}
