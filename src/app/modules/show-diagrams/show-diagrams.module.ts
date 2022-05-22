import { ReactiveFormsModule } from '@angular/forms';
import { MatModule } from '@sharedMod/mat.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from './../../shared/shared.module';
import { ShowDiagramsComponent } from './show-diagrams.component';
import { HumanActivityComponent } from './human-activity/human-activity.component';




const routes: Routes = [
  {
    path: '',
    component: ShowDiagramsComponent
  }
]



@NgModule({
  declarations: [ShowDiagramsComponent, HumanActivityComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ReactiveFormsModule,
    MatModule,
    SharedModule
  ],
  exports: []
})
export class ShowDiagramsModule { }
