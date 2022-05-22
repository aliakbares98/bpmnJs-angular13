import {
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Field } from '../../dynamic-form.interfaces';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  //encapsulation: ViewEncapsulation.None,
})
export class SelectComponent implements OnInit {
  @Input() field!: Field;
  @Input() group!: FormGroup;

  @Output() prjInput = new EventEmitter();

  public selectedOptions!: Array<string> | string;

  ngOnInit() {
    setTimeout(() => {
      if (this.field.name === 'RowCount') {
        const def = this.field.default?.toString() || '';
        this.selectedOptions = def;
        this.name.setValue(def);
        this.onSelectOption();
      }
    }, 0);
  }

  get name() {
    return this.group.controls[this.field.name];
  }

  get isMultiple() {
    if (this.field?.multiple === false) {
      return false;
    }

    return true;
  }

  onSelectOption() {
    this.prjInput.emit({
      selected: this.selectedOptions,
      name: this.field.name,
    });
  }
}
