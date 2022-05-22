import { Component, Input } from '@angular/core';
import { FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'errors',
  template: '',
})
export class ErrorsComponent {
  @Input('field') field: AbstractControl | null = null
  @Input('fieldname') fieldname = 'عدد';
  @Input('errorTxt') errorTxt: any;

  constructor() { }
}
