
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../../shared/shared.module';
import { ErrorsModule } from '@sharedMod/errors/errors.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormModule } from '@sharedMod/common-dynamic-form/dynamic-form.module';
import { OrganizationManagementRoutingModule } from './bpmsdgm.routing';
import { BpmsdgmSearchComponent } from './components/bpmsdgm-search.component';
import { BpmsdgmEditComponent } from './components/bpmsdgm-edit/bpmsdgm-edit.component';
import { CommonDynamicModule } from '@sharedMod/common-dynamic/common-dynamic.module';
import { BpmsdgmShowComponent } from './components/bpmsdgm-show/bpmsdgm-show.component';


@NgModule({
  declarations: [
    BpmsdgmSearchComponent,
    BpmsdgmEditComponent,
    BpmsdgmShowComponent
  ],
  imports: [
    CommonModule,
    OrganizationManagementRoutingModule,
    HttpClientModule,
    SharedModule,
    ErrorsModule,
    DynamicFormModule,
    CommonDynamicModule

  ],

})
export class OrganizationManagementModule { }
