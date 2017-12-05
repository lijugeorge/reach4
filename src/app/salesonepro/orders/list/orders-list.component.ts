import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { OrdersService } from '../services/orders.service';
import { UserService } from '../../settings/users/services/user.service';
import { environment } from 'environments/environment';

import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: 'orders-list',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './orders-list.html'
})
export class OrdersListComponent implements OnInit{
  orderOptions = [];
  public users = [];
  public agent = '';
  orders: any;
  error: any;
  public loading: boolean;
  public length:number = 5;
  public next = '';
  params: URLSearchParams = new URLSearchParams();

	constructor(
    private router: Router,
    private orderService: OrdersService, 
    private storage:LocalStorageService,
    private userService: UserService) {
	}

  ngOnInit() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    this.getOrderOptions();
    this.getOrders(this.params);
    this.getUsers();
    this.storage.store('activeTabIndex', -1)
  }

  getOrders(params: any) {
    this.loading = true;
    this.orderService.getOrders(params).subscribe(response => {
      this.orders = response;
      this.length = response['count'];
      this.next = response['next'];
      this.loading = false;
    });
  }

  editOrder(id) {
    this.router.navigate(['./admin/orders/edit/', id]);
  }

  trClick(id, e){
    if(e.target.localName == 'td'){
      this.router.navigate(['./admin/orders/edit/', id]);
    }
  }

  getUsers() {
    //this.params.set('group', '3');
    this.userService.getUsers(this.params).subscribe(response => {
      this.users = response['results']
    });
  }

  getOrderOptions() {
    var data = sessionStorage.getItem('orderOptions');
    if(!data){
      this.orderService.getOrderOptions().then(response => {
        this.orderOptions = response;
        sessionStorage.setItem('orderOptions',JSON.stringify(response));
      }).catch(r =>  {
        this.handleError(r);
      });
    }
    else{
      this.orderOptions = JSON.parse(data);
    }

  }

  onAgentChange(event) {
    this.agent = event.target.value;
  }


  // statusUpdate(orderId, status){
  //   let values = {
  //     "order_status": status
  //   };
  //   this.orderService.savePatch(orderId, values).then(response =>  {
  //     this.getOrders(this.params);
  //     this.getOrdersProduction(this.params);
  //   }).catch(r =>  {
  //     this.handleError(r);
  //   });
  // }

  private handleError(e: any) {
      let detail = e.detail
      if(detail && detail == 'Signature has expired.'){
        this.router.navigate(['./login']);
      }
  }
}
