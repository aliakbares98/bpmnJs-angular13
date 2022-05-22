import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  OnChanges,
  ViewEncapsulation,
} from '@angular/core';

import { FormGroup } from '@angular/forms';
import { Field } from '../../dynamic-form.interfaces';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  //encapsulation: ViewEncapsulation.None,
})
export class TextareaComponent {
  @Input() field!: Field;
  @Input() group!: FormGroup;

  get name() {
    return this.group.controls[this.field.name];
  }
}
