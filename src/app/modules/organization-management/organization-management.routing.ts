
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitDataResolverService } from '@core/services/init-data-resolver.service';
import { OrganizationManagementComponent } from './components/organization-management.component';
import { AddProcessInformationComponent } from './components/add-process-information/add-process-information.component';


const routes: Routes = [
  {
    path: 'BPMSDgmSrch',
    component: OrganizationManagementComponent
  },


  ...['BPMSDgmNew/New'].map(
    (path) => ({
      path,
      component: AddProcessInformationComponent,
      resolve: {
        initData: InitDataResolverService,

      }
    }),
  ),

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationManagementRoutingModule { }
