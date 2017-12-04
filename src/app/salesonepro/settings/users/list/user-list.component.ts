import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from "../services/user.service";
import { URLSearchParams } from '@angular/http';
import { environment } from 'environments/environment';

@Component({
  selector: 'user-list',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './user-list.html'
})
export class UserListComponent implements OnInit{
  users: any;
  public start:number = 1;
  public columns:Array<any> = [
    {title: '#', name: 'id', sort: false},
    {title: 'Name', name: 'first_name', sort: true},
    {
      title: 'Email',
      name: 'email',
      sort: true
    },
    {title: 'Type', name: 'group', sort: false},
    {title: 'Status', className: ['text-center'], name: 'is_active', sort: true},
    {title: 'Actions', className: ['text-center'], name: 'actions', sort: false}
  ];
  public page:number = 1;
  public maxSize:number = 5;
  public numPages:number = 2;
  public length:number = 5;
  public next = '';
  public loading: boolean;
  public userGroupArray = [];

  config: any = {
    paging: true,
    search: true,
    sorting: true,
    className: ['table-bordered'],
    limit: true
  };
  public data: Array<any> =[];
  params: URLSearchParams = new URLSearchParams()

  constructor(private router: Router,
    private userService: UserService) {
    // this.itemsPerPage = configuration.itemsPerPage;
    this.params.set('limit', environment.tableRowLimit);
    // this.rows = configuration.rows;
  }

  getUsers(params: any) {
    this.loading = true;
    this.userService.getUsers(params).subscribe(users => {
      this.users = users;
      this.loading = false;
     });

  }
  ngOnInit() {
    var data = sessionStorage.getItem('userGroups');
    if(data) {
      let userGroups = JSON.parse(data);
      let tt = this;
      userGroups.forEach(function(item, key) {
        tt.userGroupArray[item.id] = item.name;
      });
    }
    this.params.set('limit', environment.tableRowLimit);
    this.getUsers(this.params);
  }

  onSelectChange(event) {
    let changedValue = parseInt(event.target.value)

    if(this.next ){
      // this.itemsPerPage =  event.target.value;
      let params = this.params;
      params.set('limit', event.target.value);
      this.getUsers(params);
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
    params.set('offset', '0');

    this.getUsers(params);
  }
  // public onChangeTable(config:any, page:any = {page: this.page, itemsPerPage: environment.tableRowLimit}):any {
  //   let params = this.params;
  //   let start = (page.page - 1) * page.itemsPerPage;

  //   this.start = start + 1;
  //   params.set('limit', page.itemsPerPage);
  //   params.set('offset', start.toString());

  //   if (config.filtering) {
  //     Object.assign(this.config.filtering, config.filtering);
  //     params.set('search', this.config.filtering.filterString);
  //   }

  //   if (config.sorting) {
  //     Object.assign(this.config.sorting, config.sorting);
  //   }

  //   var sortParam = '';
  //   this.config.sorting.columns.forEach(function(col, key) {
  //     if(col.sort){
  //       if(col.sort == 'desc') {
  //         sortParam = sortParam != '' ? sortParam+',-'+col.name  : '-'+col.name;
  //       } else if(col.sort == 'asc') {
  //         sortParam = sortParam != '' ? sortParam+','+col.name  : col.name;
  //       }
  //     }
  //   });
  //   if(sortParam != '') {
  //     params.set('ordering', sortParam);
  //   }

  //   this.getUsers(params);
  // }

  editUser(user) {
    this.router.navigate(['./settings/users/edit/', user.id]);
  }

  trClick(id, e){
    if(e.target.localName == 'td'){
      this.router.navigate(['./settings/users/edit/', id]);
    }
  }

  addUser() {
    this.router.navigate(['./settings/users/add']);
  }

  deleteUser(user){
    if (confirm("Are you sure you want to delete " + user.first_name + "?")) {
      this.userService.deleteUser(user).subscribe(r =>  {
        this.getUsers(this.params);
      });

    }
  }

  private handleError(e: any) {
    let detail = e.detail
    if(detail && detail == 'Signature has expired.'){
      this.router.navigate(['./login']);
    }
  }

}
