import { Component, Input, Output, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { OrdersService } from '../../../salesonepro/orders/services/orders.service';
import { URLSearchParams } from '@angular/http';
import { environment } from 'environments/environment';



@Component({
  selector: 'order-list',
  templateUrl: './order-list.html'
})
export class OrderListComponent implements OnInit{
  @Input() id;
  @Input() status;
  @Input() agentId;

  public error = {};
	public success = '';

  optionsMap = [];
  customForm:FormGroup;
  totalStyles: number;

  public start:number = 1;
  public loading: boolean;
  public rows:Array<any> = [];
  public columns:Array<any> = [
    {title: 'Order Date', name: 'order_date'},
    {title: 'Order #', name: 'id'},
    {title: 'Company', name: 'customer__company_name', sort: true},
    {title: 'Contact Name', name: 'contact__first_name', sort: true},
    {title: 'Customer PO', name: 'customer_po', sort: false},
    {title: 'Estimated Shipping Date', name: 'estimated_shipping_date', sort: true},
    {title: 'Total Qty', className: ['text-center'], name: 'total_qty', sort: true},
    {title: 'Agent', name: 'managed_by__first_name', sort: true},
    {title: 'Actions', className: ['text-center'], name: 'actions', sort: false}];
  public page:number = 1;
  public itemsPerPage:number = 3;
  public maxSize:number = 5;
  public numPages:number = 2;
  public length:number = 5;
  public next = '';
  public orders: any;

  config: any = {
    paging: true,
    search: true,
    sorting: true,
    limit: true,
    className: ['table-bordered']
  };

  params: URLSearchParams = new URLSearchParams()

	constructor(
    private fb:FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute,
    private orderService: OrdersService, 
    // private configuration: Configuration
  ) {
    // this.itemsPerPage = configuration.itemsPerPage;
    this.params.set('limit', environment.tableRowLimit);
    // this.rows = configuration.rows;
	}

	ngOnInit() {
    if(this.status == 'completed') {
      this.columns = [
      {title: 'Order Date', name: 'order_date'},
      {title: 'Order #', name: 'id'},
      {title: 'Company', name: 'customer__company_name', sort: true},
      {title: 'Contact Name', name: 'contact__first_name', sort: true},
      {title: 'Customer PO', name: 'customer_po', sort: false},
      {title: 'Shipped Date', name: 'actual_shipping_date', sort: true},
      {title: 'Total Qty', className: ['text-center'], name: 'total_qty', sort: true},
      {title: 'Agent', name: 'managed_by__first_name', sort: true},
      {title: 'Actions', className: ['text-center'], name: 'actions', sort: false}];
      this.config = {
        paging: true,
        search: true,
        sorting: true,
        limit: true,
        className: ['table-bordered']
      };
    }
    if(this.status == 'lost') {
      this.columns = [
      {title: 'Order Date', name: 'order_date'},
      {title: 'Order #', name: 'id'},
      {title: 'Company', name: 'customer__company_name', sort: true},
      {title: 'Contact Name', name: 'contact__first_name', sort: true},
      {title: 'Customer PO', name: 'customer_po', sort: false},
      {title: 'Reason for Cancellation', name: 'order_lost_reason', sort: false},
      {title: 'Total Qty', className: ['text-center'], name: 'total_qty', sort: true},
      {title: 'Agent', name: 'managed_by__first_name', sort: true},
      {title: 'Actions', className: ['text-center'], name: 'actions', sort: false}];
      this.config = {
        paging: true,
        search: true,
        sorting: true,
        limit: true,
        className: ['table-bordered']
      };
    }
    this.getOrdersByStatus(this.params);
	}

  ngOnChanges(){

    this.getOrdersByStatus(this.params);
  }

  getOrdersByStatus(params: any) {
    this.loading = true;
    if(this.status) {
      params.set('order_status_type', this.status);
    }

    if(this.agentId){
      params.set('managed_by', this.agentId);
    }

    if(this.id) {
      params.set('customer', this.id);
    }
    params.set('view', 'all');
    this.orderService.getOrders(params).subscribe(response => {
      params.delete('order_status_type');
      params.delete('managed_by');
      params.delete('customer');
      this.orders = response;
      this.loading = false;
    });
  }


  onChangeTable(changedData) {
    let params = this.params;

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
      params.set('ordering', sortParam);
    }

    if (changedData.search !== '') {
      params.set('search', changedData.search);
    }

    let start = (changedData.page - 1) * changedData.rows;
    start = start + 1;

    params.set('limit', changedData.rows);
    params.set('offset', start.toString());

    this.getOrdersByStatus(params);
  }


  onSelectChange(event) {
    let changedValue = parseInt(event.target.value)
    if(this.next || (changedValue < this.itemsPerPage)){
      this.itemsPerPage =  event.target.value;
      let params = this.params;
      params.set('limit', event.target.value);
      this.getOrdersByStatus(params);
    }
  }

  editOrder(id) {
    this.router.navigate(['./orders/edit/', id]);
  }

  trClick(id, e){
    if(e.target.localName == 'td'){
      this.router.navigate(['./orders/edit/', id]);
    }
  }

  deleteOrder(order){
    if (confirm("Are you sure you want to delete this order?")) {
      this.orderService.deleteOrder(order).then(r =>  {
        this.getOrdersByStatus(this.params);
      }).catch(r =>  {
        this.handleError(r);
      })

    }
  }

  private handleError(e: any) {
  	this.error = e;
    let detail = e.detail
    if(detail && detail == 'Signature has expired.'){
      this.router.navigate(['./login']);
    }
  }

}
