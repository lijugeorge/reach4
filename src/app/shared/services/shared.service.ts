import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { ApiService } from './api.service';

@Injectable()
export class SharedService {
  constructor(
    private apiService: ApiService,
  ) { }

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
