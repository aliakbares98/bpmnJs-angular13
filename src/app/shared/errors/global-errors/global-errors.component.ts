import { Component, OnInit } from '@angular/core';
import { ErrorsComponent } from '../errors.component';

@Component({
  selector: 'global-errors',
  templateUrl: './global-errors.component.html',
})
export class GlobalErrorsComponent extends ErrorsComponent implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {}
}
