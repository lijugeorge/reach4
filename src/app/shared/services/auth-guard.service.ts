import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationExtras,
  CanLoad, Route
} from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { UserService } from './user.service';
import { JwtService } from './jwt.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    // this.userService.isAuthenticated.take(1);
    return this.userService.isAuthenticated.map(
        r => {
          const idToken = this.jwtService.getToken();
          const tokenExpired = idToken ? this.jwtService.isTokenExpired(idToken) : true;
            if (r && !tokenExpired) {
                // logged in so return true
                return true;
            }
             this.router.navigateByUrl('/login');
            return false;
        })
        .catch((error: any) => {
             this.router.navigateByUrl('/login');
            return Observable.of(false);
        });

    // return this.userService.isAuthenticated.take(1).map(bool => !bool);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {

    // add logic for permission
    return Observable.of(true);
  }


}
