
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BpmsdgmSearchComponent } from './components/bpmsdgm-search.component';
import { InitDataResolverService } from '@core/services/init-data-resolver.service';
import { BpmsdgmShowComponent } from './components/bpmsdgm-show/bpmsdgm-show.component';
import { ValidationResolverService } from '../../core/services/validation-resolver.service';
import { BpmsdgmEditComponent } from './components/bpmsdgm-edit/bpmsdgm-edit.component';


const routes: Routes = [
  {
    path: 'BPMSDgmSrch',
    component: BpmsdgmSearchComponent
  },


  ...['BPMSDgmNew/New','BPMSDgmUpd/:id/Edit'].map(
    (path) => ({
      path,
      component: BpmsdgmEditComponent,
      resolve: {
        initData: InitDataResolverService,

      }
    }),
  ),

  ...['BPMSDgmShow/:id/Show'].map(
    (path) => ({
      path,
      component:BpmsdgmShowComponent,
      resolve: {
        validation: ValidationResolverService
      }
    }),
  ),

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationManagementRoutingModule { }
