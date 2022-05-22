import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { toRightAnimation } from 'src/app/_animation/toRightAnimation';

@Component({
  selector: 'app-search-toolbar',
  templateUrl: './search-toolbar.component.html',
  styleUrls: ['./search-toolbar.component.scss'],
  animations: [toRightAnimation],
})
export class SearchToolbarComponent implements OnInit {
  @Input() link!: string;
  @Input() icons:any;
  @Output() createNew = new EventEmitter();

  constructor() { }

  ngOnInit(): void { }
  /*   createNewStart() {
    this.createNew.emit(true);
  } */
  btnAction(name: string) {
    switch (name) {
      case 'NewPage':
        this.createNew.emit(true);
        break;
      case 'Refresh':
        break;
      case 'Export':
        break;
      case 'Print':
        break;
    }
  }
}
