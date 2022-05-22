
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { ShowClass } from '@classes/show.class';
import { MatDialog } from '@angular/material/dialog';
import { IMsg } from '../../interfaces/msg.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { separateGroupValue } from '@methods/seprateGroupValue';
import { MsgService } from './../../services/msg-service.service';
import { EventBusService } from '@core/services/event-bus.service';
import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Field } from '@sharedMod/common-dynamic-form/dynamic-form.interfaces';
import { ErroSet, FieldValidationSet, ObjKeyStr, StatusValue, ValidationSet } from '@interfaces/global.interfaces';


@Component({
  selector: 'app-msg-show',
  templateUrl: './msg-show.component.html',
  styleUrls: ['./msg-show.component.scss'],
  providers:[]
})
export class MsgShowComponent extends ShowClass implements OnInit, OnDestroy {

  public data$!: Observable<any>;
  public override structure!: Field[];
  public override buttons = [];
  public override src: string = '';
  public override reportData: any;


  public override validationSet: ValidationSet[] = [];
  public override errorSet: ErroSet = {};
  public override fieldValidationSet!: FieldValidationSet;
  public Msg_Properties: { [key: string]: string | number } = {};
  public Msg_Mapping: { [key: string]: string | number } = {};


  public pageTitle = 'نمایش اطلاعات';

  public override parallelLabelSet: ObjKeyStr = {};
  public override comments!: StatusValue[];

  constructor(
    eventbus: EventBusService,
    elem: ElementRef,
    router: Router,
    route: ActivatedRoute,
    location: Location,
    dialog: MatDialog,
    public override service: MsgService
  ) {
    super(eventbus, elem, router, route, location, dialog);
  }

  override ngOnInit() {
    super.ngOnInit();
    this.getReportDetectRoute();
  }

  override getReportDetectRoute() {
 
    this.route.params.subscribe(async (params) => {
      if (params['id']) {
        await this.getReport(+params['id']);
        this.setMsgProperties()
        console.log('this.Msg_Properties',this.Msg_Properties);
        
      }
    });
  }

  setMsgProperties() {
    if (this.reportData?.Properties && this.reportData?.Properties.length) {
      this.Msg_Properties = separateGroupValue(this.reportData.Properties)
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
  }


}

