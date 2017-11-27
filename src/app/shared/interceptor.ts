import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';

import { environment } from '../../environments/environment';
import { JwtService } from '../shared/services/jwt.service';
import { UserService } from '../shared/services/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private http: Http,
    private jwtService: JwtService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwtToken = this.jwtService.getToken();
    if (jwtToken) {
      req = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + jwtToken)
      });
    }

    if (!req.headers.has('Content-Type')) {
      req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
    }

    return next.handle(req).catch((err) => {
      if (err instanceof HttpErrorResponse) {
        return Observable.throw(err);
        /*
        if (err.status === 401 || err.status === 403) {
           // JWT expired, go to login
           return Observable.throw(err);
        } else {
          return Observable.throw(err);
        }*/
      } else {
        return Observable.throw(err);
      }
    });

  }
}
