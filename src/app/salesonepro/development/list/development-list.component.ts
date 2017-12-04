import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

import { DevelopmentService } from '../services/development.service';
import { UserService } from '../../../shared/services/user.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-development-list',
  templateUrl: './development-list.html'
})
export class DevelopmentListComponent implements OnInit {

  agentId = '';
  salesAgentId = '';
  statusValue = '';  
  search = '';
  customers: any = {};
  columns: Array<any> = [
    {title: 'Company', name: 'customer__company_name', sort: false},
    {title: 'Dev#', name: 'id', sort: false},
    {title: 'Program', name: 'program__name', sort: false},
    {title: 'Request Date', name: 'datetime_created', sort: 'desc'},
    {title: 'Agent', name: 'artwork_agent__name', sort: false},
    {title: 'Status', className: ['text-center'], name: 'status__name', sort: true},
    {title: 'Actions', className: ['text-center'], name: 'actions', sort: false}
  ];

  config: any = {
    paging: true,
    search: true,
    sorting: true,
    className: ['table-bordered']
  };

  loading: Boolean = true;
  user: any;
  public users = [];
  public salesUsers = [];
  developmentOptions = [];

  constructor(
    private router: Router,
    private developmentService: DevelopmentService,
    private userService: UserService,
  ) { }

  ngOnInit() {

    // Initialize Params Object
    let params = new HttpParams();
    params = params.append('limit', environment.tableRowLimit);
    this.getDevelopments(params);

    this.getUsers();
    this.getSalesUsers();
    this.getDevelopmentOptions();

    let data = sessionStorage.getItem('user');
    if(data) {
      this.user = JSON.parse(data);
    }
  }

  getUsers() {
    let params = new HttpParams();
    params = params.append('group', '1,3');
    this.userService.getUsers(params).subscribe(response => {
      this.salesUsers = response['results']
    });
  }

  getSalesUsers() {
    let params = new HttpParams();
    params = params.append('group', '1,2');
    this.userService.getUsers(params).subscribe(response => {
      this.users = response['results']
    });
  }

  getDevelopmentOptions() {
    var data = sessionStorage.getItem('developmentOptions');
    if(!data){
      this.developmentService.getDevelopmentOptions().subscribe(response => {
        this.developmentOptions = response;
        sessionStorage.setItem('developmentOptions',JSON.stringify(response));
      });
    }
    else{
      this.developmentOptions = JSON.parse(data);
    }
  }

  getDevelopments(params: any) {
    this.loading = true;
    this.developmentService.getDevelopments(params).subscribe(
      (data) => {
        this.loading = false;
        this.customers = data;
      }
    );
  }

  onChangeTable(value:any) {
    if (value) {
      this.search =  value;
    }
    else{
      this.search =  '';
    }
  }
  
  createDevelopment() {
    this.router.navigate(['./developments/create']);
  }

  onSelectChange(event, type) {
    let changedValue = parseInt(event.target.value);
    this.statusValue = '';
    this.agentId = '';
    this.salesAgentId = '';
    if(event.target.value != '') {
      switch(type) { 
        case 'Status': { 
          this.statusValue = event.target.value;
          break; 
        } 
        case 'Agent': { 
          this.agentId = event.target.value;
          break; 
        } 
        case 'SalesAgent': { 
          this.salesAgentId = event.target.value;
          break; 
        }
     } 
    }
  }
}
