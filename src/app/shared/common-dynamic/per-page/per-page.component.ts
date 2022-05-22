import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'app-per-page',
  templateUrl: './per-page.component.html',
  styleUrls: ['./per-page.component.scss'],
})
export class PerPageComponent implements OnInit {
  @Output('perPage') perPage = new EventEmitter();
  perPageSet = environment.settings.perPageSet;
  constructor() {}

  ngOnInit(): void {}

  setPerpage(perPage: number) {
    this.perPage.emit(perPage);
  }
}
