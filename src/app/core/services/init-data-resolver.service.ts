import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CommonService } from '@core/services/common.service';
import { of } from 'rxjs';
import { first, map, skipWhile, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'any',
})
export class InitDataResolverService {
  constructor(private service: CommonService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.service.validation()?.pipe(
      switchMap(async (res: any) => {
        const combolod = await this.getLoadByApiKey();
        return { validation: res, load: combolod };
      })
    );
  }

  getLoadByApiKey() {
    const apiKey = this.service.signalr?.formNameAndApiKey?.ApiKey;
    if (apiKey) {
      return this.service.signalr.contractSourceChanged$
        .pipe(
          this.service.signalr.signalrPipe(apiKey),
          map((resp: any) => {
            if (resp && resp.ActionType === 'Load') {
              return resp.Data;
            }
          }),
          skipWhile((v) => v === undefined),
          first()
        )
        .toPromise();
    }

    return of(null);
  }
}
