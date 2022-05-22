import { withValidationManager } from '@sharedMod/methods/withValidationManager';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { toRightAnimation } from '../../../_animation/toRightAnimation';

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.scss'],
  animations: [toRightAnimation],
})
export class SearchListComponent
  extends withValidationManager()
  implements OnInit {
  @Input('service') override service: any;
  @Input('pageTitle') pageTitle: string | null | undefined; ///remove
  @Input('searchValidation') searchValidation: any;

  @Output('list') setData = new EventEmitter();

  public placeholder: any;
  override form: any = FormGroup;
  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      SearchValue: [''],
    });

    if (this.searchValidation.length) {
      this.validationSet = this.searchValidation;
      this.setEditFormValidations();
      this.populateValidation(this.FormCtrls);
      this.pageTitle = this?.validationSet[0].ColumnToolTip;
      this.placeholder = this.validationSet[0].ColumnLable;
    }
  }

  get SearchValue() {
    return this.form.get('SearchValue');
  }

  search() {
    const formVal = this.form.value;
    if (this.form.valid) this.setData.emit(formVal);
  }
}
