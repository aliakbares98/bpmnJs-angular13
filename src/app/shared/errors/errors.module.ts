import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalErrorsComponent } from './global-errors/global-errors.component';
import { SignalrErrorComponent } from './signalr-error/signal-error.component';

@NgModule({
  declarations: [GlobalErrorsComponent, SignalrErrorComponent],
  imports: [CommonModule],

  exports: [GlobalErrorsComponent, SignalrErrorComponent],
})
export class ErrorsModule {}
