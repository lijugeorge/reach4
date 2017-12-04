import { Component, ViewEncapsulation, OnInit, Input } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

import { URLSearchParams } from '@angular/http';
import { DevelopmentService } from "../../services/development.service";
import { SharedService } from "../../../../shared/services/shared.service";
// import { OrdersService } from "../../../orders/services/orders.service";
import { UserService } from '../../../../shared/services/user.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'development-listing',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './development-listing.html'
})
export class DevelopmentListingComponent implements OnInit{
  @Input() id;
  @Input() agent;
  @Input() search;
  @Input() salesAgent;

  developments: any = {};;
  developmentsPending: any = {};;
  loading: Boolean = true;
  columns: Array<any> = [
    {title: 'Company', name: 'customer__company_name', sort: false},
    {title: 'Dev#', name: 'id', sort: false},
    {title: 'Program', name: 'program__name', sort: false},
    {title: 'Request Date', name: 'datetime_created', sort: false},
    {title: 'Artwork Agent', name: 'artwork_agent__name', sort: false},
    {title: 'Sales Agent', name: 'sales_agent__name', sort: false},
    {title: 'Development Status', className: ['text-center'], name: 'status__name', sort: false},
  ];
  
  public users = [];
  config: any = {
    paging: true,
    search: false,
    sorting: false,
    className: ['table-bordered']
  };
  

  user: any;
  developmentOptions = [];
 params = new URLSearchParams();

	constructor(
    private router: Router,
	  private developmentservice: DevelopmentService,private sharedService: SharedService ,
    private userService: UserService
  ) {	
    this.params.set('limit', environment.tableRowLimit);
    this.params.set('ordering', '-datetime_created');
  }

  ngOnInit() {
    this.getPendingDevelopments(this.params);
    this.getStylePriceOptions();
    this.getUsers();
    this.getDevelopmentOptions();

    let data = sessionStorage.getItem('user');
    if(data) {
      this.user = JSON.parse(data);
    }
    if(!this.user.groups.includes(1)){
      if((this.user.groups.includes(2))){
        this.columns = [
          {title: 'Company', name: 'customer__company_name', sort: false},
          {title: 'Dev#', name: 'id', sort: false},
          {title: 'Program', name: 'program__name', sort: false},
          {title: 'Request Date', name: 'datetime_created', sort: false},
          {title: 'Artwork Agent', name: 'artwork_agent__name', sort: false},
          {title: 'Development Status', className: ['text-center'], name: 'status__name', sort: false},
        ];
      }
      if((this.user.groups.includes(3))){
        this.columns = [
          {title: 'Company', name: 'customer__company_name', sort: false},
          {title: 'Dev#', name: 'id', sort: false},
          {title: 'Program', name: 'program__name', sort: false},
          {title: 'Request Date', name: 'datetime_created', sort: false},
          {title: 'Sales Agent', name: 'sales_agent__name', sort: false},
          {title: 'Development Status', className: ['text-center'], name: 'status__name', sort: false},
        ];
      }
    }
    
  }

  ngOnChanges(){
    this.getPendingDevelopments(this.params);
  }

  getUsers() {
    this.userService.getUsers(this.params).subscribe(response => {
      this.users = response['results']
    });
  }

  getPendingDevelopments(params: any) {
    this.loading = true;
    params.set('status', this.id);
    if(this.agent){
      params.set('artwork_agent', this.agent);
    }
    if(this.salesAgent){
      params.set('sales_agent', this.salesAgent);
    }
    if(this.search){
      params.set('search', this.search);
    }
    this.developmentservice.getDevelopments(params).subscribe(response => {
      params.delete('status');
      params.delete('artwork_agent');
      params.delete('sales_agent');
      params.delete('search');
      this.developmentsPending = response;
      this.loading = false;
    });
  }

  getDevelopments(params: any) {
    this.loading = true;
    this.developmentservice.getDevelopments(params).subscribe(response => {
      this.developments = response;
      this.loading = false;
    });
  }

  getDevelopmentOptions() {
    var data = sessionStorage.getItem('developmentOptions');
    if(!data){
      this.developmentservice.getDevelopmentOptions().subscribe(response => {
        this.developmentOptions = response;
        sessionStorage.setItem('developmentOptions',JSON.stringify(response));
      });
    }
    else{
      this.developmentOptions = JSON.parse(data);
    }
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

    this.getPendingDevelopments(params);
  }


  getStylePriceOptions() {
    var data = sessionStorage.getItem('stylePriceOptions');
    if(!data){
      this.sharedService.getStylePriceOptions().subscribe(response => {
        sessionStorage.setItem('stylePriceOptions',JSON.stringify(response));
      });
    }
  }

  trClick(id, e){
    if(e.target.localName == 'td'){
      this.router.navigate(['./developments/edit/', id]);
    }
  }

  // deleteDevelopment(req){
  //   if (confirm("Are you sure you want to delete this development?")) {
  //     this.developmentservice.deleteDevelopment(req).subscribe(r =>  {
  //       this.getDevelopments(this.params);
  //     })
  //   }
  // }

  // createQuote(req, type) {
  //   this.developmentservice.getDevelopmentStyles(req.id, this.styleParams).subscribe(styles => {
  //     if(styles.length > 0){
  //       var postData = {};
  //       var temp = [];
  //       var pendingStyles = [];

  //       styles.forEach(function(item, key) {
  //         var arr = {};
  //         arr['style'] = item.id
  //         arr['qty'] = 1;
  //         if(item.status == 2) {
  //           temp.push(arr)
  //         }
  //         else{
  //           pendingStyles.push(arr)
  //         }
  //       });
  //       if(temp.length > 0){
  //         postData['customer'] = req.customer.id;
  //         postData['items'] = temp;
  //         postData['order_status'] = (type == 'quote') ? 1 : 2;

  //         // this.orderService.save(postData).subscribe(response => {
  //         //   this.success = (postData['order_status'] == 1 ?  'Quote' : 'Order') + ' created successfully.'
  //         //   setTimeout(function() {
  //         //      this.success = '';
  //         //      this.router.navigate(['./admin/orders/edit/', response.id]);
  //         //   }.bind(this), 3000);
  //         // }).catch(r =>  {
  //         //   this.handleError(r);
  //         // });
  //       }
  //       else{
  //         if(pendingStyles.length > 0){
  //           this.error = pendingStyles.length+' styles are in pending status.'
  //         }
  //         else{
  //           this.error = 'An error occurred. Please try again later.';
  //         }
  //       }
  //     }
  //   });
  // }

  createDevelopment() {
    this.router.navigate(['./admin/developments/create']);
  }

  private handleError(e: any) {
      let detail = e.detail
      if(detail && detail == 'Signature has expired.'){
        this.router.navigate(['./login']);
      }
  }
}
