import { Injectable } from '@angular/core';

import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { ApiService } from '@shared/index';

@Injectable()
export class CustomerService {

    private customersUrl = '';

    constructor(private apiService: ApiService) {
        this.customersUrl = '/customers/'
    }

    /** Get all customer details*/
    getCustomers(params): Observable<any> {
        return this.apiService.get(this.customersUrl, params)
        .map(
          data => {
            return data;
          }
        );
      }

    /** Get customer details by id */
    getCustomer(id: string) {
        return this.apiService.get(this.customersUrl + id + '/')
            .map(data => {
                return data;
            });
    }

    /** Save customer details */
    save(customer: any): Observable<any> {
        if (customer.id) {
            return this.put(customer);
        }
        return this.post(customer);
    }

    /** Post request for customer */
    private post(customer: any): Observable<any> {
        const headers = new Headers({
            'Content-Type': 'application/json'
        });

        return this.apiService
            .post(this.customersUrl, customer)
            .map(data => {
                return data;
            });
    }

    /** Put request for customer */
    private put(customer: any) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const url = `${this.customersUrl}${customer.id}/`;

        return this.apiService
            .put(url, customer)
            .map(data => {
                return data;
            });
    }
}
