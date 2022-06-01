
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationManagementComponent } from './components/organization-management.component';
import { AddProcessInformationComponent } from './components/add-process-information/add-process-information.component';


const routes: Routes = [
  {
    path: '',
    component: OrganizationManagementComponent
  },
  {
    path: 'add',
    component: AddProcessInformationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationManagementRoutingModule { }
