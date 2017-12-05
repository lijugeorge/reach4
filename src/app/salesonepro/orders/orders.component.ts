import {Component, ViewEncapsulation, OnInit } from '@angular/core';
import { OrdersService } from './services/orders.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: 'orders',
  templateUrl: './orders.html'
})
export class OrdersComponent implements OnInit{

    public orderTabs:Array<any> = [];
    public activeTabIndex = -1;
    constructor(
        private storage:LocalStorageService, 
        private router: Router, 
        private route: ActivatedRoute, 
        private orderService: OrdersService) {

    }

    ngOnInit() {
        this.orderTabs = this.orderService.getOrderTabs();
        var tmp = this.storage.retrieve('activeTabIndex');
        if(!tmp) {
            this.storage.store('activeTabIndex', -1);
        }

        this.storage.observe('activeTabIndex')
        .subscribe((value) => {
          this.activeTabIndex = value;
        });

    }

    onSelectDashboard() {
        this.storage.store('activeTabIndex', -1);
        this.router.navigate(["list"], { relativeTo: this.route });
    }

    onSelect(id) {
        this.orderService.setActiveTab(id);
        this.router.navigate(["edit/", id], { relativeTo: this.route });
    }

    removeTab(i) {
        this.orderService.removeOrderTab(i);
    }

}
