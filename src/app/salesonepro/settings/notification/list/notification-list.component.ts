import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from "../services/notification.service";
import { URLSearchParams } from '@angular/http';
import { environment } from 'environments/environment';

@Component({
  selector: 'notification-list',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './notification-list.html'
})
export class NotificationListComponent implements OnInit{

  notifications: any;
  public loading: boolean;
  public start:number = 1;
  public rows:Array<any> = [];
  public columns:Array<any> = [
    {title: '#', name: 'id'},
    {title: 'Email', name: 'email', sort: 'asc'},
    {title: 'Type', name: 'notification_types', sort: false },
    {title: 'Actions', className: ['text-center'], name: 'actions', sort: false}
  ];
  public page:number = 1;
  public itemsPerPage:number = 3;
  public maxSize:number = 5;
  public numPages:number = 2;
  public length:number = 5;
  public next = '';

  public config:any = {
    paging: true,
    sorting: {columns: this.columns},
    filtering: {filterString: ''},
    className: ['table-bordered']
  };
  public notificationTypes: Array<any> =[];
  params: URLSearchParams = new URLSearchParams()

  constructor(private router: Router,
    private notificationService: NotificationService) {
    this.params.set('limit', environment.tableRowLimit);
  }

  ngOnInit() {
    this.getNotificationTypes();
  }

  getNotificationTypes() {

    this.notificationService.getNotificationTypes().subscribe(response => {
      let tt = this;
      if(response['count'] > 0){
        response['results'].forEach(function(data, key) {
          tt.notificationTypes[data.id] = data.name
        });
      }

      this.params.set('limit', this.itemsPerPage.toString());
      this.getNotifications(this.params);
     });

  }

  getNotifications(params: any) {
    this.loading = true;
    this.notificationService.getNotifications(params).subscribe(users => {
      this.notifications = users;
      this.loading = false;
     })
  }

  onSelectChange(event) {
    let changedValue = parseInt(event.target.value)

    if(this.next || (changedValue < this.itemsPerPage)){
      this.itemsPerPage =  event.target.value;
      let params = this.params;
      params.set('limit', event.target.value);
      this.getNotifications(params);
    }
  }

  public onChangeTable(config:any, page:any = {page: this.page, itemsPerPage: this.itemsPerPage}):any {
    let params = this.params;
    let start = (page.page - 1) * page.itemsPerPage;

    this.start = start + 1;
    params.set('limit', page.itemsPerPage);
    params.set('offset', start.toString());

    if (config.filtering) {
      Object.assign(this.config.filtering, config.filtering);
      params.set('search', this.config.filtering.filterString);
    }

    if (config.sorting) {
      Object.assign(this.config.sorting, config.sorting);
    }

    var sortParam = '';
    this.config.sorting.columns.forEach(function(col, key) {
      if(col.sort){
        if(col.sort == 'desc') {
          sortParam = sortParam != '' ? sortParam+',-'+col.name  : '-'+col.name;
        } else if(col.sort == 'asc') {
          sortParam = sortParam != '' ? sortParam+','+col.name  : col.name;
        }
      }
    });

    if(sortParam != '') {
      params.set('ordering', sortParam);
    }

    this.getNotifications(params);
  }

  editNotificationEmail(notification) {
    this.router.navigate(['./settings/notifications/edit/', notification.id]);
  }
  addNotificationEmail() {
    this.router.navigate(['./settings/notifications/add']);
  }

  deleteNotificationEmail(notification){
    if (confirm("Are you sure you want to delete this entry?")) {
      this.notificationService.deleteNotification(notification).subscribe(r =>  {
        this.getNotifications(this.params);
      })

    }
  }

  private handleError(e: any) {
    let detail = e.detail
    if(detail && detail == 'Signature has expired.'){
      this.router.navigate(['./login']);
    }
  }

}
