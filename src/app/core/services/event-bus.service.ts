import { Injectable } from '@angular/core';
import { Subject, Subscription, BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EventBusService {
  private subject$ = new Subject();
  private behaviorSubject$ = new BehaviorSubject<any>(null);

  on(event: Events, action: any): Subscription {
    return this.subject$
      .pipe(
        filter((e: any) => e.name === event),
        map((e: EmitEvent) => e.value)
      )
      .subscribe(action);
  }
  behaviorOn(event: Events, action: any): Subscription {
    return this.behaviorSubject$
      .pipe(
        filter((e: EmitEvent) => e?.name === event),
        map((e: EmitEvent) => e.value)
      )
      .subscribe(action);
  }

  emit(event: EmitEvent) {
    this.subject$.next(event);
  }

  behaviorEmit(event: EmitEvent) {
    this.behaviorSubject$.next(event);
  }
}

export class EmitEvent {
  constructor(public name: any, public value?: any) {}
}

export enum Events {
  BackDrop,
  DFChips,
  EditPen,
  Loading,
  IsEditable,
  EditMode,
  LabelSet,
  CommentData,
  httpRequest,
  httpResponse,
  Filter,
}
