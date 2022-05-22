import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import {
  EventBusService,
  EmitEvent,
  Events,
} from '../services/event-bus.service';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class OverlayRequestInterceptor implements HttpInterceptor {
  constructor(private eventBus: EventBusService, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let apiKey: string;
    let innerType: string;
    if (req?.body) {
      const type = req?.body?.ActionType;
      apiKey = req?.body?.ApiKey;

      if (type === 'Load') {
        if (req?.body?.Data[0]?.ActionType) {
          innerType = req?.body?.Data[0]?.ActionType;
        }

        this.eventBus.emit(new EmitEvent(Events.httpRequest));
      }
    }

    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse && apiKey === 'Validation') {
          let withLoad = false;

          if (
            innerType == 'Edit' ||
            innerType == 'New' ||
            (innerType == 'Show' && this.router.url.includes('Report'))
          ) {
            event?.body?.data.forEach((el:any) => {
              if (el.DataSourceObjectName) {
                withLoad = true;
              }
            });
          }

          if (!withLoad) {
            this.eventBus.emit(new EmitEvent(Events.httpResponse));
          }
        }
      })
    );
  }
}
