
import { NgModule } from '@angular/core';
import { MatModule } from './mat.module';
import { CommonModule } from '@angular/common';
import { ErrorsModule } from './errors/errors.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ErrorsComponent } from './errors/errors.component';
import { IconComponent } from './components/icon/icon.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DiagramsComponent } from './components/diagrams/diagrams.component';
import { UploadComponent } from './components/upload/upload.component';
import { CommonDynamicModule } from './common-dynamic/common-dynamic.module';
import { DynamicFormModule } from './common-dynamic-form/dynamic-form.module';
import { NoRightClickDirective } from './directives/no-right-click.directive';
//import { ChipsBoxComponent } from './components/chips-box/chips-box.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { OperationComponent } from './components/operation/operation.component';
import { LinkModalComponent } from './components/linkModal/link-modal.component';
import { SearchListComponent } from './components/search-list/search-list.component';
import { SearchToolbarComponent } from './components/search-toolbar/search-toolbar.component';



@NgModule({
  declarations: [
    IconComponent,
    ErrorsComponent,
    UploadComponent,
    // ChipsBoxComponent,  
    PaginatorComponent,
    OperationComponent,
    LinkModalComponent,
    SearchListComponent,
    NoRightClickDirective,
    SearchToolbarComponent,
    DiagramsComponent,


  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatModule,
    FlexLayoutModule,
    DynamicFormModule,
    CommonDynamicModule,
    FlexLayoutModule

  ],
  exports: [
    IconComponent,
    ErrorsComponent,
    UploadComponent,
    PaginatorComponent,
    //  ChipsBoxComponent,
    SearchListComponent,
    SearchToolbarComponent,
    IconComponent,
    OperationComponent,
    LinkModalComponent,
    NoRightClickDirective,
    DiagramsComponent,
    DynamicFormModule,
    FlexLayoutModule,
    MatModule,



  ],
})
export class SharedModule { }
