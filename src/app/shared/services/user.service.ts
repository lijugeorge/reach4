import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { User, Navigation } from '../models';
import { environment } from '../../../environments/environment';

@Injectable()
export class UserService {
  private currentUserSubject = new BehaviorSubject<User>(new User());
  public currentUser = this.currentUserSubject.asObservable().distinctUntilChanged();

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();
  public refreshSubscription: any;

  constructor (
    private apiService: ApiService,
    private http: Http,
    private jwtService: JwtService,
    private router: Router
  ) {}

  // Verify JWT in localstorage with server & load user's info.
  // This runs once on application startup.
  populate() {
    // If JWT detected, attempt to get & store user's info
    if (this.jwtService.getToken()) {
      const token = this.jwtService.getToken();
      const tokenExpired = this.jwtService.isTokenExpired(token);
      if (tokenExpired) {
        // Remove any potential remnants of previous auth states
        this.purgeAuth();
      } else {
        const temp = {'token' : this.jwtService.getToken()};
        this.setAuth(temp);
        this.startupTokenRefresh()
      }
    } else {
      // Remove any potential remnants of previous auth states
      this.purgeAuth();
    }
  }

  setAuth(data: any) {
    // Save JWT sent from server in localstorage
    this.jwtService.saveToken(data.token);
    const user: User = this.jwtService.decodeToken(data.token);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
    this.getUserInfo(data.token);
  }

  getUserInfo(token) {
    const user = this.jwtService.decodeToken(token);
    this.apiService.get('/users/'+user.user_id)
    .subscribe(response => {
      sessionStorage.setItem('user', JSON.stringify(response));
      // Set current user data into observable
      this.currentUserSubject.next(response);
    })
  }
  purgeAuth() {
    // Remove JWT from localstorage
    this.jwtService.destroyToken();
    // Set current user to an empty object
    this.currentUserSubject.next(new User());
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
    // Unschedule the token refresh
    this.unscheduleRefresh();
  }

  attemptAuth(type, credentials): Observable<any> {

    return this.apiService.post('/api-token-auth/', credentials)
    .map(
      data => {
        this.setAuth(data);
        const jwtExp: number = this.jwtService.decodeToken(data.token).exp;
        const jwtIat = this.jwtService.decodeToken(data.token).orig_iat;
        const refreshTokenThreshold = 10; // seconds
        const delay = ((jwtExp - jwtIat) - refreshTokenThreshold) * 1000;
        sessionStorage.setItem('exp_delay', delay.toString())
        this.scheduleRefresh();
        // Get country
          this.getCountryStateList().subscribe(response => {
            sessionStorage.setItem('countryStateList', JSON.stringify(response));
        });
        // Get Orderoptions
        this.getOrderOptions().subscribe(response => {
            sessionStorage.setItem('orderOptions', JSON.stringify(response));
        });
        return data;
      }
    );
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

  // Update the user on the server (email, pass, etc)
  update(user): Observable<User> {
    return this.apiService
    .put('/user', { user })
    .map(data => {
      // Update the currentUser observable
      this.currentUserSubject.next(data.user);
      return data.user;
    });
  }

  getNavigation(): Observable<any> {
    return this.apiService.get('/navigations')
    .map(
      data => {
        return data;
      }
    );
  }

  getUsers(params: any): Observable<any> {
    return this.apiService.get('/users', params)
    .map(
      data => {
        return data;
      }
    );
  }

  getUserInfoById(id): Observable<any>  {
    return this.apiService.get('/users/'+id)
    .map(
      data => {
        return data;
      }
    );
  }

  scheduleRefresh() {
    // If the user is authenticated, use the token stream
    // provided by angular2-jwt and flatMap the token
    const idToken = this.jwtService.getToken();
    const source = Observable.of(idToken).flatMap(
      token => {
        console.log('refresh scheduled')
        // The delay to generate in this case is the difference
        // between the expiry time and the issued at time
        const jwtExp: number = this.jwtService.decodeToken(token).exp;
        const jwtIat = this.jwtService.decodeToken(token).orig_iat;
        const refreshTokenThreshold = 10; // seconds
        // const delay = ((jwtExp - jwtIat) - refreshTokenThreshold) * 1000;
        const delay = sessionStorage.getItem('exp_delay')
        // tslint:disable-next-line:radix
        return Observable.interval(parseInt(delay));
      });

    this.refreshSubscription = source.subscribe(() => {
      console.log('token refresh subscription')
      this.getNewJwt();
    });
  }

  startupTokenRefresh() {
    console.log('startupTokenRefresh')
    // If the user is authenticated, use the token stream
    // provided by angular2-jwt and flatMap the token
    const idToken = this.jwtService.getToken();
    const tokenExpired = idToken ? this.jwtService.isTokenExpired(idToken) : true;
    if (!tokenExpired) {
      const source = Observable.of(idToken).flatMap(
        token => {
        // Get the expiry time to generate

        const now: number = new Date().valueOf() / 1000;
        const jwtExp: number = this.jwtService.decodeToken(token).exp;
        const jwtIat = this.jwtService.decodeToken(token).orig_iat;

        const refreshTokenThreshold = 10; // seconds
        // a delay in milliseconds
        let delay: number = jwtExp - now ;
        const totalLife: number = (jwtExp - jwtIat);
        (delay < refreshTokenThreshold ) ? delay = 1 : delay = delay - refreshTokenThreshold;
        // Use the delay in a timer to
        // run the refresh at the proper time
        return Observable.timer(delay * 1000);
      });

       // Once the delay time from above is
       // reached, get a new JWT and schedule
       // additional refreshes
       source.subscribe(() => {
         this.getNewJwt();
         this.scheduleRefresh();
       });
    }
  }

  unscheduleRefresh() {
    // Unsubscribe from the refresh
    if (this.refreshSubscription) {
      console.log('refresh un scheduled')
      this.refreshSubscription.unsubscribe();
    }
  }

  getNewJwt() {
    const idToken = this.jwtService.getToken();
    this.http.post(`${environment.api_url}/api-token-refresh/`, { token:  idToken}).toPromise()
    .then(response => {
      console.log('token refreshed')
      const data = response.json();
      this.setAuth(data);
    }).catch(error => {
      console.log('token refresh failed')
      const errorDetail = error.json();
      if (errorDetail.non_field_errors && errorDetail.non_field_errors[0] === 'Signature has expired.') {
       this.purgeAuth()
      }
    });
  }

  getCustomers(params): Observable<any> {
    return this.apiService.get('/customers/', params)
    .map(
      data => {
        return data;
      }
    );
  }

  getCountryStateList(): Observable<any> {
    return this.apiService.get('/country_state_list')
      .map(data => {
        return data
      });
  }

  getOrderOptions(): Observable<any>  {
    return this.apiService.get('/order_options/')
    .map(data => {
      return data
    });
  }
}
