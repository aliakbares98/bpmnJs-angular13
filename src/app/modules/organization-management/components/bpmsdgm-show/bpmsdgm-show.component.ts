
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EventBusService } from '@services/event-bus.service';
import { BmpsdgmService } from '../../service/bpmsdgm.service';
import { separateGroupValue } from '@methods/seprateGroupValue';
import { ShowClass } from './../../../../shared/classes/show.class';
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Field } from '@sharedMod/common-dynamic-form/dynamic-form.interfaces';
import { ErroSet, FieldValidationSet, ObjKeyStr, StatusValue, ValidationSet } from '@interfaces/global.interfaces';



@Component({
  selector: 'app-bpmsdgm-show',
  templateUrl: './bpmsdgm-show.component.html',
  styleUrls: ['./bpmsdgm-show.component.scss']
})
export class BpmsdgmShowComponent extends ShowClass implements OnInit, OnDestroy {

  public data$!: Observable<any>;
  public override structure!: Field[];
  public override buttons = [];
  public override src: string = '';
  public override reportData: any;

  public override validationSet: ValidationSet[] = [];
  public override errorSet: ErroSet = {};
  public override fieldValidationSet!: FieldValidationSet;
  public bpmsdgm_Properties: { [key: string]: string | number } = {};
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
    public override service: BmpsdgmService
  ) {
    super(eventbus, elem, router, route, location, dialog);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.getReportDetectRoute();
  }

  override getReportDetectRoute() {
    this.route.params.subscribe(async (params) => {
      if (params['id']) {
        await this.getReport(+params['id']);
        this.setMsgProperties()

      }
    })

  }
  setMsgProperties() {
    if (this.reportData?.Properties && this.reportData?.Properties.length) {
      this.bpmsdgm_Properties = separateGroupValue(this.reportData.Properties)
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
  }

}
