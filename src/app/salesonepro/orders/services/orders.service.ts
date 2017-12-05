import {Injectable} from '@angular/core';
import { Router } from '@angular/router';
import { Headers, Http, Response, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { ApiService } from '../../../shared/services/api.service';
import { Observable } from 'rxjs/Observable';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';

@Injectable()
export class OrdersService {

    private moduleUrl = '';

    public orderTabId = '';
    public orderTabs:Array<any> = [];
    public currentOrderTab = [];

    constructor(
        private apiService: ApiService, 
        private router: Router, 
        private storage:LocalStorageService
    ) {
        this.moduleUrl = '/orders/'
    }


    getOrderTabs() {
        var data = sessionStorage.getItem('userSettings');
        if(data) {
            let userSettings = JSON.parse(data);
            let parent = this;
            if(userSettings.length > 0) {
                userSettings.forEach(function(col, key) {
                    if(col.codename == 'opened_tabs') {
                        sessionStorage.setItem('orderTabId', col.id);
                        parent.orderTabId = col.id;
                    }
                });
            }
            this.orderTabs = [];
            let responseOrderTabs = JSON.parse(sessionStorage.getItem('userOrderTabs'))
            if(responseOrderTabs && responseOrderTabs.length > 0) {
                responseOrderTabs.forEach(function(row, k) {
                    let tmp = {id: row.order_id, page: row.page};
                    var index = parent.currentOrderTab.lastIndexOf(row.order_id);
                    if(index < 0) {
                       parent.currentOrderTab.push(row.order_id)
                    }
                    parent.orderTabs.push(tmp)
                });
            }
        }
        return this.orderTabs;
    }

    setActiveTab(id) {
        var index = this.currentOrderTab.lastIndexOf(id);
        if(index < 0) {
            let tmp = {'id': id, page: 'order-information'};
            this.orderTabs.push(tmp);
            this.currentOrderTab.push(id)
            let modifiedTab = [];
            if(this.orderTabs.length > 0) {
                let parent = this;
                this.orderTabs.forEach(function(row, k) {
                    let tmp = {order_id: row.id, page: row.page};
                    modifiedTab.push(tmp);
                });
            }

            this.updateOrderTab(modifiedTab);
            var index = this.currentOrderTab.lastIndexOf(id);
            this.storage.store('activeTabIndex', index);
        }
        else{
            this.storage.store('activeTabIndex', index);
        }
    }

    updateActiveTabPage(id, page) {
        var index = this.currentOrderTab.lastIndexOf(id);
        if(index >= 0) {
            let modifiedTab = [];
            this.orderTabs[index].page = page;
            this.orderTabs.forEach(function(row, k) {
                let tmp = {order_id: row.id, page: row.page};
                modifiedTab.push(tmp);
            });
            let orderTabId = sessionStorage.getItem('orderTabId');
            if(orderTabId) {
                this.updateOrderTab(modifiedTab);
            }
        }
    }

    getTabDetails(id) {
        var index = this.currentOrderTab.lastIndexOf(id);
        if(index >= 0) {
            return this.orderTabs[index]
        }
        else{
            return false;
        }
    }

    removeOrderTab(i) {
        this.orderTabs.splice(i, 1);
        this.currentOrderTab.splice(i, 1);
        let revisedIndex = i - 1;
        let modifiedTab = [];
        if(this.orderTabs.length > 0) {
            let parent = this;
            this.orderTabs.forEach(function(row, k) {
                let tmp = {order_id: row.id, page: row.page};
                modifiedTab.push(tmp);
            });
        }

        this.updateOrderTab(modifiedTab);
        if(revisedIndex < 0) {
            this.router.navigate(["./admin/orders/list"]);
            this.storage.store('activeTabIndex', -1);
        }
        else{
            let id = this.currentOrderTab[revisedIndex];
            this.router.navigate(["./admin/orders/edit/", id]);
            this.storage.store('activeTabIndex', revisedIndex);
        }
    }

    updateOrderTab(modifiedTab) { console.log('updateOrderTab')
        let headers = new Headers({
                'Content-Type': 'application/json'});
        let userDetails = JSON.parse(sessionStorage.getItem('user'));

        let req = {user: userDetails.id, codename: 'opened_tabs', data: JSON.stringify(modifiedTab)};
        sessionStorage.setItem('userOrderTabs', JSON.stringify(modifiedTab));
        let orderTabId = sessionStorage.getItem('orderTabId');
        if(orderTabId) {
            this.apiService
                .put('/user_settings/'+orderTabId, req)
                .toPromise()
                .then(response => {
                    let tmp = [];
                    tmp.push(response.json());
                    sessionStorage.setItem('userSettings', JSON.stringify(tmp));
                })
                .catch(this.handleError);
        }
        else{
            this.saveOrderTab(req).subscribe(response =>  {
                let tmp = [];
                tmp.push(response);
                sessionStorage.setItem('userSettings', JSON.stringify(tmp));
                sessionStorage.setItem('orderTabId', response.id);
            })
        }
    }


    saveOrderTab(req: any) : Observable<any>{
        let headers = new Headers({
            'Content-Type': 'application/json'});
        return this.apiService
            .post('/user_settings', req)
            .map(
                data => {
                    return data;
                }
            );
    }

    getOrders(params: any): Observable<any> {

        return this.apiService.get(this.moduleUrl, params)
            .map(
                data => {
                    return data;
                }
            );
    }

    getOrder(id: string) {
        return this.apiService.get(this.moduleUrl+ id+'/')
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    getOrderDetails(id) {
        var data = sessionStorage.getItem('order-'+id);
        if(!data){
          this.getOrder(id).then(response => {
            sessionStorage.setItem('order-'+id,JSON.stringify(response));
            return response;
          }).catch(r =>  {
            this.handleError(r);
          });
        }
        else{
         return JSON.parse(data);
        }
    }

    getOrderOptions() {
        return this.apiService.get('/order_options/')
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    save(req: any): Promise<any>  {
        if (req.id) {
            return this.put(req);
        }
        return this.post(req);
    }

    savePatch(id: any, req: any): Promise<any>  {
        return this.patch(id, req);
    }


    private post(req: any): Promise<any> {
        let headers = new Headers({
            'Content-Type': 'application/json'});

        return this.apiService
            .post(this.moduleUrl, req)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    private put(req: any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let url = `${this.moduleUrl}/${req.id}`;

        return this.apiService
            .put(url, req)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    private patch(id: any, req: any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let url = `${this.moduleUrl}${id}/`;

        return this.apiService
            .patch(url, req)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    deleteOrder(req: any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let url = `${this.moduleUrl}${req.id}/`;

        return this.apiService
            .delete(url)
            .toPromise()
            .catch(this.handleError);
    }

    private handleError(error: any) {
        return Promise.reject(error.json());
    }
}