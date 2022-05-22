import {
  Component,
  OnInit,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';

import { NotifyService } from '../../services/notify.service';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import {
  EmitEvent,
  EventBusService,
  Events,
} from '../../services/event-bus.service';
import { swingingFromSide } from '../../../_animation/swinging';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss'],
  animations: [swingingFromSide],
})
export class NotifyComponent implements OnInit, OnDestroy {
  private _showNotify = false;

  badgeHidden = false;

  @Output('toggle') toggle = new EventEmitter<any>(true);

  public grabage: Subscription = new Subscription();
  constructor(
    public _eref: ElementRef,
    public service: NotifyService,
    private eb: EventBusService
  ) { }

  ngOnInit(): void {
    this.initNotify();
  }

  initNotify() {
    this.service.initNotify()?.subscribe((data) => {
      if (data) {
        const reverseData = [...data].reverse();
        this.service.signalr.notifyList = [
          ...reverseData,
          ...this.service.signalr.notifyList,
        ];
        this.service.signalr.notifyCount =
          this.service.signalr.notifyList.length;
        this.reInitNotify();
      }
    });
  }

  reInitNotify() {
    this.service.signalr.connection.onreconnected(() => {
      this.initNotify();
    });
  }

  delete(index: number) {
    const item: any = this.service.signalr.notifyList[index];
    if (typeof item.CardboardId !== 'undefined') {
      this.service.deletNotifyBy(item.CardboardId)?.subscribe((result) => {
        if (result.Status === '10000') {
          this.service.signalr.notifyList =
            this.service.signalr.notifyList.filter(
              (el) => el.CardboardId !== item.CardboardId
            );

          this.postDelete();
        }
      });
    } else {
      this.service.signalr.notifyList.splice(index, 1);
      this.postDelete();
    }
  }

  postDelete() {
    this.service.signalr.notifyCount = this.service.signalr.notifyCount - 1;
    // this._showNotify = false;
    //this.badgeHidden = false;
    //  this.eb.emit(new EmitEvent(Events.BackDrop, false));
  }

  get showNotify() {
    return this._showNotify;
  }

  showDescription(id: number) {
    this.service.signalr.notifyList.map((item) => {
      if (item.CardboardId === id) {
        return (item.open = !item.open);
      }
      return;
    });
  }

  clearAll() {
    this.service.deletAllNotity()?.subscribe((result) => {
      if (result.Status === '10000') {
        this.service.signalr.notifyList = [];
        this.service.signalr.notifyCount = 0;
        this._showNotify = false;
        this.badgeHidden = false;
        this.eb.emit(new EmitEvent(Events.BackDrop, false));
      }
    });
  }

  bellToggle() {
    this._showNotify = !this._showNotify;
    this.badgeHidden = !this.badgeHidden;
    this.toggle.emit(this._showNotify);
  }

  close() {
    this._showNotify = false;
    this.badgeHidden = false;
  }
  ngOnDestroy() {
    this.grabage.unsubscribe();
  }
}
