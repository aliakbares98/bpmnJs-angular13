
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatModule } from '@sharedMod/mat.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoginRoutingModule } from './login-routing.module';
import { LoginErrorsComponent } from './login-errors/login-errors.component';



@NgModule({
  declarations: [
    LoginErrorsComponent,
    LoginRoutingModule.components
  ],

  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    FlexLayoutModule,
    MatModule
  ],
  providers: []

})
export class LoginModule { }
