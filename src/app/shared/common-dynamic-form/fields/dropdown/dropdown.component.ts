import {
  ChangeDetectionStrategy,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { Component } from '@angular/core';
import { Field } from '../../dynamic-form.interfaces';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent {
  @Input() field!: Field;
  @Input() group!: FormGroup;

  public selectedOptions: Array<string> = [];

  get name() {
    return this.group.controls[this.field.name];
  }

  get isMultiple() {
    if (this.field?.multiple === false) {
      return false;
    }

    return true;
  }
}
