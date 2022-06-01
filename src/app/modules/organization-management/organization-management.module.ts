
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './../../shared/shared.module';
import { ErrorsModule } from '@sharedMod/errors/errors.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormModule } from '@sharedMod/common-dynamic-form/dynamic-form.module';
import { OrganizationManagementRoutingModule } from './organization-management.routing';
import { OrganizationManagementComponent } from './components/organization-management.component';
import { AddProcessInformationComponent } from './components/add-process-information/add-process-information.component';


@NgModule({
  declarations: [
    OrganizationManagementComponent,
    AddProcessInformationComponent
  ],
  imports: [
    CommonModule,
    OrganizationManagementRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
    ErrorsModule,
    DynamicFormModule

  ],

})
export class OrganizationManagementModule { }
