
import { Subscription } from 'rxjs';
import { MenuList } from '../header.interfaces';
import { MenuService } from '../../services/menu.service';
import {  Component,  OnInit,  ElementRef,  OnDestroy,  EventEmitter,  Output,} from '@angular/core';


@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  providers:[MenuService]
})
export class UserMenuComponent implements OnInit, OnDestroy {
  @Output('toggle') toggle = new EventEmitter<any>(true);
  public _showMenu: boolean = false;
  public menuList!: MenuList[];
  private grabage: Subscription = new Subscription();

  constructor(public _eref: ElementRef, private service: MenuService) {}

  ngOnInit(): void {
    this.menu();
  }

  get showMenu() {
    return this._showMenu;
  }

  moreToggle() {
    this._showMenu = !this._showMenu;
    this.toggle.emit(this._showMenu);
  }

  close() {
    this._showMenu = false;
  }

  menu() {
    this.grabage.add(
      this.service.getmenu()?.subscribe((data) => {
        this.menuList = data;
      })
    );
    // }
  }

  ngOnDestroy() {
    this.grabage.unsubscribe();
  }
}
