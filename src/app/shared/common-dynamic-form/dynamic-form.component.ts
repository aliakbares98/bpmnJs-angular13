import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
  Output,
  AfterViewInit,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { Field } from './dynamic-form.interfaces';

@Component({
  selector: 'app-dynamic-form',
  template: '',
  styleUrls: ['./dynamic-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormComponent implements OnInit, AfterViewInit, OnDestroy {
  // @Input() structure: Observable<Field[]>;
  @Input() structure!: Field[];
  @Input() buttons: any;
  @Input() src!: string;
  @Input() data$!: Observable<any>;
  @Input() touchedForm$!: Observable<boolean>;
  @Output() submitDF: EventEmitter<any> = new EventEmitter();
  unsubscribe$: Subject<void> = new Subject();
  form!: FormGroup;

  constructor(public fb: FormBuilder) {
    const self: any = window;
    self['DF'] = this;
  }

  ngOnInit() {
    /*     this.structure
      .pipe(
        map(this.formBuilder),
        tap((f) => (this.form = f)),
        tap((f) => this.listenFormChanges(f)),
        (f$) => combineLatest([f$, this.data$]),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(this.patchValue); */

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

  ngAfterViewInit() {
    if (this.src && this.src !== '') {
      this.loadScript();
    }
  }

  public loadScript() {
    const body = document.body;
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `/assets/js/${this.src}`;
    script.async = true;
    script.defer = true;
    body.appendChild(script);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public makeForm() {
    this.form = this.formBuilder(this.structure);
    // this.listenFormChanges(this.form);
  }

  public formBuilder = (structure: Field[]): FormGroup => {
    const group = this.fb.group({});
    structure.forEach((field) => {
      if (field.type === 'Range') {
        Object.keys(field.name).forEach((el:any) => {
          return group.addControl(field.name[el], this.control(field));
        });
      } else {
        return group.addControl(field.name, this.control(field));
      }
    });

    return group;
  };

  public control = (field: Field): FormControl => {
    return this.fb.control('');
    //return this.fb.control('', field.validator);
  };

  /*   public patchValue = ([form, data]) => {
    !!data
      ? form.patchValue(data, { emitEvent: false })
      : form.patchValue({}, { emitEvent: false });
  }; */

  /*   public listenFormChanges(form: FormGroup) {
    form.valueChanges.pipe(debounceTime(100)).subscribe((changes: any) => {
      this.updateForm.emit(changes);
    });
  } */

  /*   send(value) {
    let formVal = {};
    if (typeof this.form !== 'undefined') {
      formVal = this.form.value;
    }

    this.submitDF.emit({ form: formVal, userAction: value });
  } */
  get hasStructure() {
    return typeof this.structure !== 'undefined' && this.structure.length > 0;
  }
}
