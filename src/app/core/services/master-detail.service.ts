import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class MasterDetailService {
  public commentSubject$ = new BehaviorSubject<any[]>([]);
  public commentChanged$ = this.commentSubject$.asObservable();

  public chipsArrSubject$ = new BehaviorSubject<any>([]);
  public chipsArrChanged$ = this.chipsArrSubject$.asObservable();

  constructor() {}
}
