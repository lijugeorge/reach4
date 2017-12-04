import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

import { CustomerService } from '../services/customer.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.html'
})
export class CustomerListComponent implements OnInit {

  customers: any = {};
  columns: Array<any> = [
    { title: '#', name: 'id', sort: false },
    { title: 'Company', name: 'company_name' },
    { title: 'Company Id', name: 'company_code', sort: true },
    { title: 'Contact Name', name: 'default_contact__first_name', sort: true },
    { title: 'Email', name: 'default_contact__email', className: ['email'], sort: true },
    { title: 'Phone', name: 'default_contact__phone', sort: false },
    { title: 'Last Order Date', className: ['text-center'], name: 'last_order_date', sort: false },
    { title: 'Total Orders', className: ['text-center'], name: 'total_order_count', sort: false },
    { title: 'Total Amount', className: ['text-center'], name: 'total_order_amount', sort: false },
    { title: 'Actions', className: ['text-center'], name: 'actions', sort: false }
  ];

  config: any = {
    paging: true,
    search: true,
    sorting: true,
    className: ['table-bordered'],
    limit: true
  };

  loading: Boolean = true;
  public start:number = 1;
  constructor(
    private router: Router,
    private customerService: CustomerService
  ) { }

  ngOnInit() {

    // Initialize Params Object
    let params = new HttpParams();
    params = params.append('limit', environment.tableRowLimit);
    this.getCustomers(params);
  }

  getCustomers(params: any) {
    this.loading = true;
    this.customerService.getCustomers(params).subscribe(
      (data) => {
        this.loading = false;
        this.customers = data;
      }
    );
  }

  onChangeTable(changedData) {
    let params = new HttpParams();

    let sortParam = '';
    this.columns.forEach(function(col, key) {
      if (col.sort) {
        if (col.sort === 'desc') {
          sortParam = sortParam !== '' ? sortParam + ',' + col.name  : '-' + col.name;
        } else if (col.sort === 'asc') {
          sortParam = sortParam !== '' ? sortParam + ',' + col.name  : col.name;
        }
      }
    });

    if (sortParam !== '') {
      params = params.append('ordering', sortParam);
    }

    if (changedData.search !== '') {
      params = params.append('search', changedData.search);
    }

    let start = (changedData.page - 1) * changedData.rows;
    start = start + 1;

    params = params.append('limit', changedData.rows);
    params = params.append('offset', start.toString());

    this.getCustomers(params);
  }
  addCustomer() {
    this.router.navigate(['./customers/add']);
  }

  editCustomer(id) {
    this.router.navigate(['./customers/edit/', id]);
  }

  trClick(id, e) {
    if (e.target.localName === 'td') {
      this.router.navigate(['./customers/edit/', id]);
    }
  }

  viewOrderHistory(id) {
    this.router.navigate(['./customers/order-history/', id]);
  }

  viewCustomer(id) {
    this.router.navigate(['./customers/details/', id]);
  }

}
