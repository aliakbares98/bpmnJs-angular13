import { LinkClass } from './../../interfaces/global.interfaces';
import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-operation',
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.scss'],
})
export class OperationComponent {
  @Input() item:any;
  @Output() iconOnClicked = new EventEmitter();

  defaultIOperations: LinkClass[] = [];
  moreOperations: LinkClass[] = [];
  linkClass: LinkClass[] = [];

  constructor() {}

  ngOnInit() {
    if (this.item?.LinkClass?.length > 0) {
      this.linkClass = this.sortLinkClass(this.item?.LinkClass);
      this.linkClass
        .sort((a: any, b: any) => {
          return a.ToolTipCode - b.ToolTipCode;
        })
        .forEach((el, elKey) => {
          if (elKey < 3) {
            this.defaultIOperations.push(el);
          } else {
            this.moreOperations.push(el);
          }
        });
    }
  }

  iconAction(operation:any) {
    this.iconOnClicked.emit(operation);
  }

  sortLinkClass(linkClass: any[]) {
    const sorted = linkClass.sort((a, b) => {
      return a.IconCode - b.IconCode;
    });

    return sorted;
  }
}
