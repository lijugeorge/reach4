import { Injectable } from '@angular/core';

import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { ApiService } from '@shared/index';
import { retry } from 'rxjs/operator/retry';

@Injectable()
export class DevelopmentService {

    private developmentsUrl = '';

    constructor(private apiService: ApiService) {
        this.developmentsUrl = '/developments'
    }

    getDevelopmentOptions(): Observable<any> {
        return this.apiService.get('/development_options')
            .map(
            data => {
                return data;
            }
        );
    }

    /** Get all development styles*/
    getDevelopmentStyles(id: string, params: any): Observable<any> {
        return this.apiService.get(this.developmentsUrl+'/'+ id+'/styles/', params)
            .map(
            data => {
                return data;
            }
        );
    }

     /** Get all development comments*/
    getDevelopmentComments(id: string, params: any): Observable<any> {
        return this.apiService.get(this.developmentsUrl+'/'+ id+'/comments/', params)
            .map(
            data => {
                return data;
            }
        );
    }

    /** Get all development details*/
    getDevelopments(params): Observable<any> {
        return this.apiService.get(this.developmentsUrl, params)
            .map(
            data => {
                return data;
            }
            );
    }

    /** Get development details by id */
    getDevelopment(id: string) {
        return this.apiService.get(this.developmentsUrl+ '/' + id)
            .map(data => {
                return data;
            });
    }

    /** Save Development details */
    save(development: any): Observable<any> {
        if (development.id) {
            return this.put(development);
        }
        return this.post(development);
    }

    savePatch(id: any, req: any): Observable<any>  {
        return this.patch(id, req);
    }

    /** Post request for development */
    private post(development: any): Observable<any> {
        const headers = new Headers({
            'Content-Type': 'application/json'
        });

        return this.apiService
            .post(this.developmentsUrl, development)
            .map(data => {
                return data;
            });
    }

    /** Put request for development */
    private put(development: any) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const url = `${this.developmentsUrl}/${development.id}`;

        return this.apiService
            .put(url, development)
            .map(data => {
                return data;
            });
    }

    private patch(id: any, req: any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const url = `${this.developmentsUrl}/${id}`;
        // let url = `${this.moduleUrl}/${id}`;

        return this.apiService
            .patch(url,(req))
            .map(data => {
                return data;
            });
    }

    deleteDevelopmentStyle(id, styleId) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let url = `${this.developmentsUrl}/${id}/styles/${styleId}/`;

        return this.apiService
            .delete(url)
            .map(data => {
                return data;
            });
    }

    saveDevelopmentStyles(styles: any): Observable<any>  {
        if (styles.id) {
            return this.putDevelopmentStyles(styles);
        }
        return this.postDevelopmentStyles(styles);
    }

    private postDevelopmentStyles(styles: any): Observable<any> {

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const url = `${this.developmentsUrl}/${styles.development}/styles/`;

        return this.apiService
            .post(url, styles)
            .map(data => {
                return data;
            });
    }

    private putDevelopmentStyles(styles: any) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const url = `${this.developmentsUrl}/${styles.development}/styles/`;

        return this.apiService
            .put(url, styles)
            .map(data => {
                return data;
            });
    }

    getStyle(id: string): Observable<any>  {
        return this.apiService.get( '/styles/' + id+'/')
            .map(data => {
                return data;
            });
    }

    saveStyles(styles: any): Observable<any>  {
        if(styles.id) {
            return this.putStyles(styles);
        }
        return this.postStyles(styles);
    }

    private postStyles(styles: any): Observable<any> {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.apiService
            .post('/styles/', styles)
            .map(data => {
                return data;
            });
    }

    private putStyles(styles: any) {

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.apiService
            .put('/styles/'+styles.id+'/', styles)
            .map(data => {
                return data;
            });
    }

    saveComments(values: any): Observable<any>  {
        return this.postComment(values, values.development);
    }

    private postComment(values: any, developmentId: any): Observable<any> {

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const url = `${this.developmentsUrl}/${developmentId}/comments/`;

        return this.apiService
            .post(url, values)
            .map(data => {
                return data;
            });
    }
}
