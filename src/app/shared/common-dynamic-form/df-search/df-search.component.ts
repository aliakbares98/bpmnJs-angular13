import { ValidationSet } from './../../interfaces/global.interfaces';
import { EventEmitter, Input, OnChanges } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeUntil, filter } from 'rxjs/operators';

import { DynamicFormComponent } from '../dynamic-form.component';
import { EventBusService } from '@core/services/event-bus.service';
import { Subscription } from 'rxjs';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { withValidationManager } from '@sharedMod/methods/withValidationManager';

@Component({
  selector: 'df-search',
  templateUrl: './df-search.component.html',
  styleUrls: ['./df-search.component.scss', './../../../_scss/cur/list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('comeIn', [
      state('void', style({ opacity: 0, transform: 'translateY( -30px )' })),

      transition('void=>*', [animate('1s ease-out')]),

      transition('*=>void', [animate('1s ease-out')]),
    ]),
  ],
})
export class DFSearchComponent
  extends withValidationManager(DynamicFormComponent)
  implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() serverSideStructure: any[] = [];
  @Input() clientSideStructure: any[] = [];
  @Input() classifiedValidation!: {[key: string]: ValidationSet[]}

  @Output() updateForm = new EventEmitter();
  @Output() prjInput = new EventEmitter();

  public serverSideForm!: FormGroup;
  public clientSideForm!: FormGroup;

  public grabage: Subscription = new Subscription();

  constructor(fb: FormBuilder, private eventbus: EventBusService) {
    super(fb);
  }

  override ngOnInit() {
    if (
      typeof this.serverSideStructure !== 'undefined' &&
      this.serverSideStructure.length > 0
    ) {
      this.validationSet = this.classifiedValidation['ServerSide'];
      this.setEditFormValidations();
      this.serverSideForm = this.formBuilder(this.serverSideStructure);
      this.populateValidation(this.serverSideForm.controls);

      this.serverSideStructure = this.serverSideStructure.map((field: any) => {
        if (field.type === 'Range') {
          field.errors.To = this?.errorSet[field?.name?.To];
          field.errors.From = this?.errorSet[field?.name?.From];
        } else {
          field.errors = this?.errorSet[field.name];
        }

        return field;
      });
    }

    if (this.touchedForm$) {
      this.touchedForm$
        .pipe(
          filter((t) => !t && !!this.form),
          takeUntil(this.unsubscribe$)
        )
        .subscribe((_) => this.form.reset());
    }
  }

  ngOnChanges() {
    if (this.clientSideStructure.length && !this.clientSideForm) {
      this.clientSideForm = this.formBuilder(this.clientSideStructure);
      this.populateValidation(this.clientSideForm.controls);
      this.clientSideStructure = this.clientSideStructure.map((field: any) => {
        field.errors = this?.errorSet[field.name];
        return field;
      });
    }
  }

  override ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.grabage.unsubscribe();
  }

  onPrjInput(event: any) {
    this.prjInput.emit(event);
  }
}
