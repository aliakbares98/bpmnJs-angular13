import { Component, OnInit } from '@angular/core';
import { ErrorsComponent } from '@sharedMod/errors/errors.component';

@Component({
  selector: 'login-errors',
  templateUrl: './login-errors.component.html',
})
export class LoginErrorsComponent extends ErrorsComponent implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {}
}
