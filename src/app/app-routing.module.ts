import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from '@core/auth/auth-guard.guard';
import { MainComponent } from '@core/main/main.component';
import { NotFoundComponent } from '@core/not-found/not-found.component';
import { DashboardComponent } from './core/dashboard/dashboard.component';



const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuardGuard],
      },
      {
        path: 'Management',
        loadChildren: () => import(`./modules/managment/managment.module`).then((m) => m.ManagmentModule),
      },
      {
        path: 'Management',
        loadChildren: () => import(`./modules/organization-management/bpmsdgm.module`).then((m) => m.OrganizationManagementModule),
      },
      { 
        path: 'diagram',
        loadChildren: () => import(`./modules/show-diagrams/show-diagrams.module`).then((m) => m.ShowDiagramsModule),
      }
      // {
      //   path: 'Buy',
      //   loadChildren: () => import(`./modules/buy/buy.module`).then((m) => m.BuyModule),
      // },

    ],
  },
  { path: '**', component: NotFoundComponent },
  { path: '404', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
