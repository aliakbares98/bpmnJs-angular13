import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { InputComponent } from './fields/input/input.component';
import { TextareaComponent } from './fields/textarea/textarea.component';
import { Field } from './dynamic-form.interfaces';
import { ChipsComponent } from './fields/chips/chips.component';
import { SelectComponent } from './fields/select/select.component';
import { ComboComponent } from './fields/combo/combo.component';
import { Renderer2 } from '@angular/core';
import { DateComponent } from './fields/date/date.component';
import { DropdownComponent } from './fields/dropdown/dropdown.component';
import { RangeComponent } from './fields/range/range.component';

const componentsMapper: { [key: string]: Type<any> } = {
  TextBox: InputComponent,
  TextArea: TextareaComponent,
  Chips: ChipsComponent,
  DropDown: DropdownComponent,
  Select: SelectComponent,
  ComboBox: ComboComponent,
  DatePicker: DateComponent,
  Range: RangeComponent,
};

@Directive({
  selector: '[appDynamicField]',
})
export class DynamicFieldDirective implements OnInit, OnChanges {
  @Input() field!: Field;
  @Input() group!: FormGroup;

  @Output() prjInput = new EventEmitter();

  component!: ComponentRef<any>;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef,
    private renderer: Renderer2
  ) { }

  ngOnChanges() {
    if (this.component) {
      this.component.instance.field = this.field;
      this.component.instance.group = this.group;
      this.component.instance?.prjInput.subscribe((data: any) => {
        this.prjInput.emit(data);
      });
    }
  }

  ngOnInit() {
    const component = this.resolver.resolveComponentFactory<any>(
      componentsMapper[this.field.type]
      
    );

    this.component = this.container.createComponent(component);
    const el = this.component.location.nativeElement;
    if (this.field.col) this.renderer.addClass(el, this.field.col);
    //this.renderer.addClass(el, this.field.model ? 'fxflex' : 'col-4');
    this.component.instance.field = this.field;
    this.component.instance.group = this.group;

    if (this.component.instance?.prjInput) {
      this.component.instance?.prjInput.subscribe((data: any) => {
        this.prjInput.emit(data);
      });
    }
  }
}
