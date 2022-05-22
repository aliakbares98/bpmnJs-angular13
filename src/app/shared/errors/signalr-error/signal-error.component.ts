import { Component } from '@angular/core';
import { ErrorsComponent } from '../errors.component';

@Component({
  selector: 'signalr-error',
  templateUrl: './signalr-error.component.html',
})
export class SignalrErrorComponent extends ErrorsComponent {
  constructor() {
    super();
  }
}
