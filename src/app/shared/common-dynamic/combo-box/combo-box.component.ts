
import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  AbstractControl,
  ControlContainer,
} from '@angular/forms';
import { Subject, of, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,

} from 'rxjs/operators';
import { switchMap, last, tap, takeUntil } from 'rxjs/operators';
import {
  OnInit,
  OnChanges,
  OnDestroy,
  Optional,
  Host,
  SkipSelf,
} from '@angular/core';
import { ComboItem } from '@interfaces/global.interfaces';

@Component({
  selector: 'combo-box',
  templateUrl: './combo-box.component.html',
  styleUrls: ['./combo-box.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ComboBoxComponent),
      multi: true,
    },
  ],
})
export class ComboBoxComponent
  implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
  @Input() formControlName!: string;
  @Input('list') list: any;
  @Input('label') label: any;
  @Input('errorTxt') errorTxt!: string;
  @Input('service') service: any;
  @Input('method') method!: string;
  @Input('allowed') allowed = true;
  @Input('class') inputColor = 'gray-input';
  @Input('hasTitle') hasTitle = true;
  @Input('title') setTitle!: string;
  @Input('displayFormat') displayFormat = 'base';
  @Input('hasMessage') hasMessage!: boolean;
  @Input('isDisabled') isDisabled = false;
  @Input('editMode') editMode: boolean = false;
  @Input('status') status!: string;
  @Input('param') param: any;
  @Input('showClear') showClear: boolean = true;

  @Output('projectId') setId = new EventEmitter();
  @Output('loading') loading = new EventEmitter();
  @Output('snakbar') snakbar = new EventEmitter();
  @Output('changed') modelStatus = new EventEmitter();
  @Output('clicked') clicked = new EventEmitter();
  @Output('getData') getData = new EventEmitter();

  public searchTerm = new Subject<string>();
  ngUnsubscribe = new Subject<void>();

  public grabage: Subscription = new Subscription();

  public data: any;
  private _title = '';
  public _value = null;
  private keyStroke: string = '';

  public shortKey = false;
  public noResult = false;
  public control: AbstractControl | null | undefined;

  @ViewChild('input') input!: ElementRef;
  @ViewChild('clearBtn') clearBtn!: ElementRef;

  constructor(
    @Optional()
    @Host()
    @SkipSelf()
    private controlContainer: ControlContainer,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    if (typeof this.service !== 'undefined') {
      this.setupSearchDebouncer();
    }
    if (this.controlContainer) {
      this.control = this.controlContainer.control?.get(this.formControlName);
    }
  }

  ngOnChanges() {
    if (this.setTitle) {
      this._title = this.setTitle;
    }
  }

  get title() {
    return this._title;
  }

  updateTitle(title: string) {
    this._title = title;
    this.onTouch();
  }

  onSelectItem(item: any) {
    if (this.hasTitle) {
      this._title = item.Value;
      this._value = item.Id;
    } else {
      this._title = item.Value;
      this._value = item.Value;
    }

    this.displayFormat === 'complex'
      ? this.setId.emit(item)
      : this.setId.emit(this._value);

    this.data = null;
    this.propagateChange(this._value);
  }

  writeValue(formValue: any) {
    if (formValue === null) {
      this._value = null;
      this._title = '';

      setTimeout(() => {
        this.propagateChange(this._value);
      });
    }

    if (formValue && typeof formValue !== 'undefined' && formValue !== '') {
      this._value = formValue.Id;
      this._title = formValue.Value;
      this.data = null;
      // this.displayFormat == 'complex'
      //   ? this.setId.emit(formValue)
      //   : this.setId.emit(this._value);

      setTimeout(() => {
        this.propagateChange(this._value);
        if (this.control?.status === 'DISABLED') {
          this.setDisabledState();
        }
      });
    }
  }

  propagateChange = (_: any) => { };
  onTouch: any = () => { };

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  change($event: any) {
    this._value = null;

    this.keyStroke = $event.target.value;

    if (
      (typeof this.service === 'undefined' && this.list.length > 0) ||
      (!this.allowed && this.list.length > 0)
    ) {
      this.data = this.filterVal(this.keyStroke, this.list);
    } else {
      if (this.allowed) {
        this.searchTerm.next(this.keyStroke);
      }
    }
  }

  private filterVal(value: string, list: any) {
    const filterValue = value.toLowerCase();

    if (this.displayFormat == 'complex') {
      return list.filter(
        (option: any) =>
          option.Value.toLowerCase().indexOf(filterValue) !== -1 ||
          option.Code.toLowerCase().indexOf(filterValue) !== -1
      );
    }
    return list.filter(
      (option: any) => option.Value.toLowerCase().indexOf(filterValue) !== -1
    );
  }

  focusFunction() {
    this.data = this.list;

    if (
      (!this.allowed && this.hasMessage) ||
      (typeof this.list !== undefined && this.hasMessage)
    ) {
      this.snakbar.emit(true);
    }
  }

  getTitle(item: string) {
    if (item && typeof this.list !== 'undefined' && this.list.length > 0) {
      return this.list.find((item: ComboItem) => item.Id === item.Id).Value;
    }
  }

  private setupSearchDebouncer(): void {
    this.searchTerm
      .pipe(
        takeUntil(this.ngUnsubscribe),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((val) => {
          if (typeof 'string' && val.length > 3) {
            this.loading.emit('pending');
            this.shortKey = false;
            const result = this.searchRq(val);

            if (result) {
              return result;
            }

            return of(null);
          }

          this.shortKey = true;
          return of(null);
        })
      )
      .subscribe(
        (data) => {
          this.loading.emit('done');
          this.getData.emit(data);
          this.data = data;
          if (!data && this.keyStroke.length > 3) {
            this.noResult = true;
          } else {
            this.noResult = false;
          }
        },
        (error) => {
          this.loading.emit('error');
        }
      );
  }

  search() {
    this.clicked.emit(true);
    if (this.keyStroke.length <= 3 && this.allowed && this.service) {
      this.loading.emit('pending');
      this.shortKey = false;
      this.grabage.add(
        this.searchRq(this.keyStroke)?.subscribe(
          (data: any) => {
            this.loading.emit('done');
            this.getData.emit(data);
            this.data = data;
            if (!data) {
              this.noResult = true;
            }
          },
          (error: any) => {
            this.loading.emit('error');
          }
        )
      );
    }
  }

  searchRq(val: string) {
    return this.service[this.method](val)?.pipe(last());
  }

  clearInput() {
    this._value = null;
    this._title = '';
    this.setId.emit(this._value);
    this.propagateChange(this._value);
  }

  get shortKeyMessage() {
    return;
  }

  updateRecordStatus() {
    this.modelStatus.emit(true);
  }

  setDisabledState() {
    if (this.input) {
      this.renderer.setProperty(this.input?.nativeElement, 'disabled', true);
      if (this.clearBtn) {
        this.renderer.setStyle(this.clearBtn?.nativeElement, 'display', 'none');
      }
    }
  }

  isClicked() {
    this.clicked.emit(true);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.grabage.unsubscribe();
  }
}
