import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { EventBusService, Events } from '../services/event-bus.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MainComponent implements OnInit, OnDestroy {
  public show = false;
  public status = 'sleep';

  private grabage: Subscription = new Subscription();
  constructor(private eventbus: EventBusService) {}

  ngOnInit(): void {
    this.grabage.add(
      this.eventbus.on(Events.BackDrop, (state: boolean) => (this.show = state))
    );
  }

  toggle(state: any) {
    this.show = state;
  }

  ngOnDestroy() {
    this.grabage.unsubscribe();
  }
}
