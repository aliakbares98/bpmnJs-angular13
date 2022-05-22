import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { takeUntil, filter } from 'rxjs/operators';

import { DynamicFormComponent } from '../dynamic-form.component';

@Component({
  selector: 'df-reform',
  templateUrl: './df-reform.component.html',
  styleUrls: ['./df-reform.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DFReformComponent
  extends DynamicFormComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  constructor(fb: FormBuilder) {
    super(fb);
  }

  override ngOnInit() {
    if (typeof this.structure !== 'undefined' && this.structure.length > 0) {
      this.makeForm();
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

  override ngAfterViewInit() {
    if (this.src && this.src !== '') {
      this.loadScript();
    }
  }

  public override loadScript() {
    const body = document.body;
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `/assets/js/${this.src}`;
    script.async = true;
    script.defer = true;
    body.appendChild(script);
  }

  override ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  send(value: any) {
    let formVal = {};
    if (typeof this.form !== 'undefined') {
      formVal = this.form.value;
    }

    this.submitDF.emit({ form: formVal, userAction: value });
  }
  override get hasStructure() {
    return typeof this.structure !== 'undefined' && this.structure.length > 0;
  }

  prjInput(value:any) {
    console.log('prjInput', value);
  }
}
