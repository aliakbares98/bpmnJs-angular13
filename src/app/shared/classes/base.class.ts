import { findFormNameBy } from '@sharedMod/methods/findFormName';

import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { PublicClass } from './public.class';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { StatusValue } from '../interfaces/global.interfaces';
import { withValidationManager } from '../methods/withValidationManager';
import { setLocalItemBy } from '@sharedMod/methods/setLocalItemBy';

@Component({
  selector: 'app-field-validation',
  template: '',
})
export class BaseClass
  extends withValidationManager(PublicClass)
  implements OnInit, OnDestroy {
  public override wpId!: number;
  public override cpsId!: number;
  public override service: any;
  public comments: StatusValue[] = [];
  public override grabage: Subscription = new Subscription();
  public override workFlowTypeCommand!: string;

  constructor(public location?: Location) {
    super();
  }

  override ngOnInit(): void {
    const pageState = history.state;
    this.setPageState(pageState);
  }

  getComments(id: number) {
    this.service?.getComments(id)?.subscribe((data: any) => {
      this.comments = data;
    });
  }

  setPageState(pageState: any) {
    //this.service.dfContract.FormTag = null;
    const apiKey = pageState['ApiKey'];
    const formNames = pageState['FormName'];
    const workFlowTypeCommand = pageState['WorkFlowTypeCommand'];

    let formName = findFormNameBy(formNames, 3);
    let dyFormName:undefined |string = findFormNameBy(formNames, 4);
    const currentApikey = setLocalItemBy(apiKey, 'hermes_ApiKey');
    const currentFormName = setLocalItemBy(formName, 'hermes_FormName');
    const dynamicFormName = setLocalItemBy(dyFormName, 'hermes_DyFormName');
    this.workFlowTypeCommand = setLocalItemBy(
      workFlowTypeCommand,
      'hermes_WorkFlowTypeCommand'
    );

    if (this.service) {
      this.service.signalr.formNameAndApiKeySubject$.next({
        ApiKey: currentApikey,
        FormTag: currentFormName,
      });

      if (dynamicFormName) {
        this.service.dfContract.FormTag = dynamicFormName;
      }
    }
  }

  clearContractIds() {
    sessionStorage.removeItem('hermes_cpsId');
    sessionStorage.removeItem('hermes_wpId');

    if (this.service) {
      this.service.signalr.contractIdsSubject$.next({
        CurrentProcessStatusId: null,
        WorkflowProcessId: null,
      });
    }
  }
  clearApiKeyAndFormName() {
    sessionStorage.removeItem('hermes_ApiKey');
    sessionStorage.removeItem('hermes_FormName');

    if (this.service) {
      this.service.signalr.formNameAndApiKeySubject$.next({
        ApiKey: null,
        FormTag: null,
      });
    }
  }

  trackByFn(index: number, el: any): number {
    return el.Id;
  }
  backFn() {
    this.location?.back();
  }

  override  ngOnDestroy() {
    this.clearContractIds();
    this.clearApiKeyAndFormName();
    sessionStorage.removeItem('hermes_DyFormName');
    sessionStorage.removeItem('hermes_WorkFlowTypeCommand');
    this.grabage.unsubscribe();
  }
}
