import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import {  CanActivate,  ActivatedRouteSnapshot,  RouterStateSnapshot,  UrlTree,  Router,} from '@angular/router';

@Injectable({
  providedIn: 'root',
})


export class AuthGuardGuard implements CanActivate {
  
  constructor(private auth: AuthService, private router: Router) {}
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const id = next.params['id'];

    if (
      (this.auth.isLoggedIn && state.url === '/dashboard') ||
      (this.auth.isLoggedIn &&
        state.url !== '/dashboard' &&
        this.auth.hasPermission(state.url, id))
    ) {
      return true;
    } else {
      if (!this.auth.isLoggedIn) {
        this.auth.redirectToLogin();
      } else {
        this.router.navigate(['/404']);
      }
      return false;
    }
  }
}
