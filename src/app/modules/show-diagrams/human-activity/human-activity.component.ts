import { Component, OnInit } from '@angular/core';
import { ObjKeyStr } from '@interfaces/global.interfaces';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { EditBaseClass } from './../../../shared/classes/edit-base.class';

@Component({
  selector: 'app-human-activity',
  templateUrl: './human-activity.component.html',
  styleUrls: ['./human-activity.component.scss']
})
export class HumanActivityComponent extends EditBaseClass implements OnInit {

  public override parallelLabelSet: ObjKeyStr = {};
  public override form!: FormGroup;


  constructor(public override fb: FormBuilder) {
    super(fb)
  }

  states = [
    { id: 1, value: 'Alabama' },
    { id: 2, value: 'Alaska' },
    { id: 3, value: 'Alabama' },
    { id: 4, value: 'Alabama' },
    { id: 5, value: 'Alabama' },
    { id: 6, value: 'Alabama' },
    { id: 7, value: 'Alabama' },
    { id: 8, value: 'Alaska' },
    { id: 9, value: 'Alabama' },
    { id: 10, value: 'Alabama' },
    { id: 11, value: 'Alabama' },
    { id: 12, value: 'Alabama' },

  ];
  public statusList: Array<string> = [];
  public showList: any;

  override ngOnInit(): void {
    super.ngOnInit()
  this.initForm();
  }

  override initForm: any = () => {
    this.form = this.fb.group({
      tblInv_Search: this.fb.group({
        Model: [this.modelSet['test']],
        knot: [''],
        formType: [''],
        formThemp: [''],
      }),
      tblInv_operation: this.fb.group({
        Model: [this.modelSet['test']],
        priority: [''],
        activity: [''],
        operation: [''],
      }),
      tblInv_conditions: this.fb.group({
        Model: [this.modelSet['test']],
        priority: [''],
        condition: [''],
        activity: [''],
        field: [''],
        value: [''],
        testValue: [''],
      }),

    })
  }

  getPackingGroupBy(index: number) {
    return this

  }

  OnPackingTypeSelected(id: number) {
    if (this.wpId) {
      const formGroup = this.getPackingGroupBy(0);
      this.updateRecordStatusSetBy(formGroup);
      // this.clearPackingValue();
    }

  }

  get PackingControls() {
    return (this.form.get('tblInv_ProductPackings') as FormArray).controls;
  }

}
