import { ErrorsModule } from './../errors/errors.module';
import { CommonDynamicModule } from './../common-dynamic/common-dynamic.module';

import { NgModule } from '@angular/core';
import { MatModule } from '../mat.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DateComponent } from './fields/date/date.component';
import { DynamicFormComponent } from './dynamic-form.component';
import { InputComponent } from './fields/input/input.component';
import { ChipsComponent } from './fields/chips/chips.component';
import { ComboComponent } from './fields/combo/combo.component';
import { RangeComponent } from './fields/range/range.component';
import { EditPenComponent } from './edit-pen/edit-pen.component';
import { DynamicFieldDirective } from './dynamic-field.directive';
import { SelectComponent } from './fields/select/select.component';
import { DFReformComponent } from './df-reform/df-reform.component';
import { DFSearchComponent } from './df-search/df-search.component';
import { TextareaComponent } from './fields/textarea/textarea.component';
import { DropdownComponent } from './fields/dropdown/dropdown.component';


@NgModule({
  declarations: [
    DynamicFormComponent,
    DFReformComponent,
    DFSearchComponent,
    InputComponent,
    TextareaComponent,
    ChipsComponent,
    DynamicFieldDirective,
    EditPenComponent,
    SelectComponent,
    DropdownComponent,
    ComboComponent,
    DateComponent,
    RangeComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatModule,
    CommonDynamicModule,
    FlexLayoutModule,
    ErrorsModule,
  ],
  // entryComponents: [
  //   InputComponent,
  //   TextareaComponent,
  //   ChipsComponent,
  //   ComboComponent,
  //   ComboBoxComponent,
  //   DateComponent,
  //   SelectComponent,
  //   DropdownComponent,
  //   RangeComponent,
  // ],
  exports: [
    DynamicFormComponent,
    DFReformComponent,
    DFSearchComponent,
    TextareaComponent,

  ],
})
export class DynamicFormModule {}
