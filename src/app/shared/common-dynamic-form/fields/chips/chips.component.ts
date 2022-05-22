import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  OnChanges,
} from '@angular/core';

import { FormGroup } from '@angular/forms';
import { Field } from '../../dynamic-form.interfaces';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Subscription } from 'rxjs';
import {
  EventBusService,
  Events,
} from 'src/app/core/services/event-bus.service';
import { OnDestroy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipsComponent implements OnInit, OnDestroy {
  @Input() field!: Field;
  @Input() group!: FormGroup;

  public list: string[] = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  private grabage: Subscription = new Subscription();
  constructor(
    private eventbus: EventBusService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.grabage.add(
      this.eventbus.on(Events.DFChips, (list: any) => {
        this.list = list;
        this.group.get(this.field.name)?.setValue(list);
        this.cdr.detectChanges();
      })
    );
  }

  remove(el: string): void {
    const index = this.list.indexOf(el);

    if (index >= 0) {
      this.list.splice(index, 1);
      this.group.get(this.field.name)?.setValue(this.list);
    }
    /*     const index = this.field.list.indexOf(el);

    if (index >= 0) {
      this.field.list.splice(index, 1);
      this.group.get(this.field.name)?.setValue(this.field.list);
    } */
  }

  get name() {
    return this.group.controls[this.field.name];
  }

  ngOnDestroy() {
    this.grabage.unsubscribe();
  }
}
