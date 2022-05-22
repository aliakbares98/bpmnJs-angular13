
import { Subscription } from 'rxjs';
import { BaseClass } from './base.class';
import { Location } from '@angular/common';
import { inverse } from '../methods/inverse';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RecordStatus, CommentData } from '@interfaces/global.interfaces';

@Component({
  selector: 'app-edit',
  template: '',
})
export class EditBaseClass extends BaseClass implements OnInit, OnDestroy {
  public override form!: FormGroup;
  public initLoad = [];
  public selectedAttachment: Array<number> = [];
  public uploadDisabled: Array<boolean> = [true];
  public override service: any;
  public attachValid!: boolean;
  public _submitAllowed = true;
  public override reportData: any;
  public maxSize = 20000000;
  public override wpId!: number;
  public override cpsId!: number;
  public  contactRoleId!: number;
  public override recordStatusSet: RecordStatus[] = [];
  public override grabage: Subscription = new Subscription();


  constructor(public fb: FormBuilder,
     public override location?: Location) {
    super();
  }

  initForm: any = () => { };

  override ngOnInit(): void {
    if (!this.contactRoleId) {
      const pageState = history.state;
      this.setContractIdsByState(pageState);
    }
    super.ngOnInit();
  }
  setmaxSizeErr(maxSize: number, ctrl: any) {
    ctrl.setErrors({ maxSize });
  }
  inValidExtention(ext: string, ctrl: any) {
    ctrl.setErrors(ext);
  }
  /*
    add highlighte class to input
  */
  addInputMarker(statusValue?: any) {
    setTimeout(() => {
      if (statusValue) {
        let lastComment = statusValue[0];
        const inversedLabelSet = inverse(this.parallelLabelSet);
        const dyData: CommentData[] = [...lastComment.Data];
        const chipsIndex = dyData.findIndex(
          (el: CommentData) => el.KeyName === 'CheckableFields'
        );

        const chips = dyData[chipsIndex]?.Value;

        if (chips) {
          // let chipsArr = chips.split(',').map((el) => el.replace(/\"/g, ''));
          let chipsArr = JSON.parse(chips);
          chipsArr.forEach((el: string) => {
            const formField = document.querySelectorAll(
              `.${inversedLabelSet[el]}`
            );

            if (formField) {
              formField.forEach((el) => {
                el.classList.add('pink-input');
              });
            }
          });
        }
      }
    }, 0);
  }

  get submitDisabled() {
    if (!this._submitAllowed) {
      return true;
    }

    if (this.workFlowTypeCommand === 'Edit' && !this.cpsId) {
      if (!this.formEdited && !this.service?.formEdited$?.getValue()) {
        return true;
      } else if (this.formEdited || this.service?.formEdited$?.getValue()) {
        return false;
      }
    }
    return false;
  }

  onAttachChange(valid: boolean) {
    this.attachValid = valid;
  }
  formEditedInChilde(edited: boolean) {
    this.formEdited = edited;
  }
  concatChildRecordStatus(newSet: any) {
    this.recordStatusSet = [...this.recordStatusSet, ...newSet];
  }

  override ngOnDestroy() {
    this.grabage.unsubscribe();
    super.ngOnDestroy();
  }
}
