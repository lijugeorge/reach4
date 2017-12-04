import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { ApiService } from './api.service';

@Injectable()
export class SharedService {
  constructor(
    private apiService: ApiService,
  ) { }

  getStylePriceOptions() {
    return this.apiService.get('/style_price_options')
    .map(data => {
      return data
    });
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

  getTasks(params: any): Observable<any> {
    return this.apiService.get('/tasks/', params)
      .map(data => {
        return data
      });
  }

  getTaskTypes(): Observable<any> {
    
    return this.apiService.get('/task_types/')
      .map(data => {
        return data
      });
  }

  getTask(id: string) {
      return this.apiService.get('/tasks/'+ id+'/')
      .map(data => {
        return data
      });
  }

  saveTask(req: any): Observable<any> {
    return this.apiService
        .post('/tasks/', req)
        .map(data => {
          return data;
      });
  }

  updateTask(id: any, req: any): Observable<any>  {
    return this.patch(id, req);
  }

  /** Post request*/
  private patch(id, req: any): Observable<any> {
    const headers = new Headers({
        'Content-Type': 'application/json'
    });

    return this.apiService
        .patch(`/tasks/${id}/`, req)
        .map(data => {
            return data;
        });
  }

  getStyles(params: any): Observable<any> {
    return this.apiService.get('/styles/', params)
      .map(data => {
        return data
      });
  }
}
