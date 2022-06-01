import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatModule } from '@sharedMod/mat.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '@sharedMod/shared.module';
import { ManagmentRoutingModule } from './managment.routing';
import { ErrorsModule } from '@sharedMod/errors/errors.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComboBoxModule } from '@syncfusion/ej2-angular-dropdowns';
import { MsgEditComponent } from './components/msg-edit/msg-edit.component';
import { MsgShowComponent } from './components/msg-show/msg-show.component';
import { MsgSearchComponent } from './components/msg-search/msg-search.component';
import { DynamicFormModule } from '@sharedMod/common-dynamic-form/dynamic-form.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [MsgSearchComponent, MsgEditComponent, MsgShowComponent],
  imports: [
    CommonModule,
    ManagmentRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
    ErrorsModule,
    DynamicFormModule
  ],

})
export class ManagmentModule { }
