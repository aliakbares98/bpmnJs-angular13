import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsgShowComponent } from './components/msg-show/msg-show.component';
import { MsgEditComponent } from './components/msg-edit/msg-edit.component';
import { MsgSearchComponent } from './components/msg-search/msg-search.component'
import { ValidationResolverService } from './../../core/services/validation-resolver.service';
import { InitDataResolverService } from '@core/services/init-data-resolver.service';



const routes: Routes = [
  {
    path: 'MessageSearch',
    component: MsgSearchComponent
  },

  ...['MsgRgs/New',
    'MsgUpd/:id/Edit',
  ].map(
    (path) => ({
      path,
      component: MsgEditComponent,
      resolve: {
        initData: InitDataResolverService,
      }
    }),
  ),

  ...['MsgShow/:id/Show',
    'MsgDel/:id/Delete'
  ].map((path) => ({
    path,
    component: MsgShowComponent,
    resolve: {
      validation: ValidationResolverService,
    }
  })),




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagmentRoutingModule { }
