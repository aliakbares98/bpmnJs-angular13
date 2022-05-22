import { AuthService } from './../auth/auth.service';
import { Subscription } from 'rxjs';
import { NotifyComponent } from './notify/notify.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { EventBusService, EmitEvent, Events, } from '../services/event-bus.service';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  host: {
    '(document:click)': 'close($event)',
  },
})
export class HeaderComponent implements OnInit, OnDestroy {
  private _bellState!: boolean;
  private _moreState!: boolean;

  public url!: string;
  private grabage: Subscription = new Subscription();

  constructor(
    private eventbus: EventBusService,
    private router: Router,
    private authService: AuthService
  ) { }

  @ViewChild(NotifyComponent)
  private notify!: NotifyComponent;
  @ViewChild(UserMenuComponent)
  private menu!: UserMenuComponent;

  ngOnInit(): void {
    this.grabage.add(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.url = this.router.routerState.snapshot.url;
        }
      })
    );
    this.url = this.router.routerState.snapshot.url;
  }

  bellToggle(state: boolean) {
    this.eventbus.emit(new EmitEvent(Events.BackDrop, state));
    this._bellState = state;
  }
  moreToggle(state: boolean) {
    this.eventbus.emit(new EmitEvent(Events.BackDrop, state));
    this._moreState = state;
  }

  close(event: any) {
    if (
      this._bellState &&
      !this.notify._eref.nativeElement.contains(event.target)
    ) {
      this.notify.close();
      this.eventbus.emit(new EmitEvent(Events.BackDrop, false));
      this._bellState = false;
    } else if (this._moreState) {
      this.menu.close();
      this.eventbus.emit(new EmitEvent(Events.BackDrop, false));
      this._moreState = false;
    }
  }



  logout() {
    this.grabage.add(
      this.authService.logout().subscribe(()=>{
        this.authService.redirectToLogin();
      })
    )
  }

  ngOnDestroy() {
    this.grabage.unsubscribe();
  }
}
