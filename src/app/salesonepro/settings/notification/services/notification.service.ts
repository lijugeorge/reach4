import {Injectable} from '@angular/core';

import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { ApiService } from '@shared/index';

@Injectable()
export class NotificationService {

    private notificationUrl = '';
    private notificationTypeUrl = '';

    constructor(
        private apiService: ApiService
    ) {
        this.notificationUrl = '/notifications';
        this.notificationTypeUrl = '/notification_types';
    }

    getNotifications(params: any): Observable<any> {
        return this.apiService.get(this.notificationUrl)
            .map(
                data => {
                    return data;
                }
            );
    }

    getNotificationTypes(): Observable<any> {
        return this.apiService.get(this.notificationTypeUrl)
            .map(
                data => {
                    return data;
                }
            );
    }

    getNotification(id: string) {
        return this.apiService.get(this.notificationUrl + '/' + id)
            .map(
                data => {
                    return data;
                }
            );
    }

    save(Data: any): Observable<any>  {
        if (Data.id) {
            return this.put(Data);
        }
        return this.post(Data);
    }

    private post(Data: any): Observable<any> {
        let headers = new Headers({
            'Content-Type': 'application/json'});

        return this.apiService
            .post(this.notificationUrl, Data)
            .map(
                data => {
                    return data;
                }
            );
    }

    private put(Data: any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let url = `${this.notificationUrl}/${Data.id}`;

        return this.apiService
            .put(url, Data)
            .map(
                data => {
                    return data;
                }
            );
    }

    deleteNotification(data: any): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let url = `${this.notificationUrl}/${data.id}`;

        return this.apiService
            .delete(url)
            .map(
                data => {
                    return data;
                }
            );
    }

    private handleError(error: any) {
        return Promise.reject(error.json());
    }
}