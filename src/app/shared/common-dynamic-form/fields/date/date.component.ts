import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';

import { FormGroup } from '@angular/forms';
import { Field } from '../../dynamic-form.interfaces';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateComponent {
  @Input() field!: Field;
  @Input() group!: FormGroup;

  @Output() prjInput = new EventEmitter();

  get name() {
    return this.group.controls[this.field.name];
  }

  dateInput(date:any) {
    this.prjInput.emit(date);
  }
}
