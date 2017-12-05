import {Injectable} from '@angular/core';

import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { ApiService } from '@shared/index';

@Injectable()
export class UserService {

    private userUrl = '';
    private userGroupUrl = '';

    constructor(private apiService: ApiService) {
        this.userUrl = '/users';
        this.userGroupUrl = '/groups';
    }

    getUsers(params: any): Observable<any> {
        return this.apiService.get('/users', params)
            .map(
            data => {
                return data;
            }
        );
    }

    getUserGroups(): Observable<any> {
        return this.apiService.get('/groups')
            .map(
                data => {
                    return data;
                }
            );
    }

    getUser(id: string) {
        return this.apiService.get('/users/' + id)
            .map(
                data => {
                    return data;
                }
            );
    }

    save(User: any): Observable<any>  {
        if (User.id) {
            return this.put(User);
        }
        return this.post(User);
    }

    private post(User: any): Observable<any> {

        const formData = new FormData();
        formData.append('avatar', User.avatar);
        formData.append('first_name', User.first_name);
        formData.append('last_name', User.last_name);
        formData.append('email', User.email);
        formData.append('is_active', User.is_active);
        formData.append('groups', User.groups);
        formData.append('password', User.password);

        return this.apiService
        .post('/users', formData)
        .map(data => {
            return data;
        });
    }

    private put(User: any) {
        const formData = new FormData();
        formData.append('avatar', User.avatar);
        formData.append('first_name', User.first_name);
        formData.append('last_name', User.last_name);
        formData.append('email', User.email);
        formData.append('is_active', User.is_active);
        formData.append('groups', User.groups);
        formData.append('password', User.password);
        
        let url = `/users/${User.id}`;

        return this.apiService
            .put(url, formData)
            .map(data => {
                return data;
            });
    }

    deleteUser(User: any){

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let url = `/users/${User.id}`;

        return this.apiService
            .delete(url)
            .map(data => {
                return data;
            });
    }

}