import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';

import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-range',
  templateUrl: './range.component.html',
  styleUrls: ['./range.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeComponent implements OnInit {
  @Input() field: any;
  @Input() group!: FormGroup;

  @Output() prjInput = new EventEmitter();

  ngOnInit() {
  }

  get from() {
    return this.group.controls[this.field?.name?.From];
  }
  get to() {
    return this.group.controls[this.field?.name?.To];
  }

  /*   fromInput(event) {
    this.prjInput.emit({ form: event.target.value, to: this.to.value });
  }
  toInput(event) {
    this.prjInput.emit({ form: this.from.value, to: event.target.value });
  } */
}
