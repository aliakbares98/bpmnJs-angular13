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
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
  @Input() field!: Field;
  @Input() group!: FormGroup;

  @Output() prjInput = new EventEmitter();

  get name() {
    return this.group.controls[this.field.name];
  }

  txtInput(event:any) {
    this.prjInput.emit({
      selected: event.target.value,
      name: this.field.name,
    });
  }
}
