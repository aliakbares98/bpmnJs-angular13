import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CommonService } from '@core/services/common.service';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'any',
})
export class ValidationResolverService {
  constructor(private service: CommonService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.service.validation()?.pipe(first());
  }
}
