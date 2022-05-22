import { Component, OnInit, Input } from '@angular/core';
import { Field } from '../../dynamic-form.interfaces';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-combo',
  templateUrl: './combo.component.html',
  styleUrls: ['./combo.component.scss'],
})
export class ComboComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  @Input() field!: Field;
  @Input() group!: FormGroup;

  get name() {
    return this.group.controls[this.field.name];
  }
}
