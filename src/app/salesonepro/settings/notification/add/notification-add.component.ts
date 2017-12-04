import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { NotificationService } from "../services/notification.service";

@Component({
  selector: 'notification-add',
  templateUrl: './notification-add.html'
})
export class NotificationAddComponent implements OnInit{

  public userGroups = [];
  public success = '';
  public error = {};
  public page = '';

	constructor(
    private router: Router,
    private notificationService: NotificationService,
    public toastr: ToastsManager,
    public vcr: ViewContainerRef
  ) {
    this.toastr.setRootViewContainerRef(vcr);
	}
  ngOnInit() {
    this.page = 'add';
  }

  onSave(values: any) {
    this.notificationService.save(values).subscribe(r =>  {
      this.toastr.success('Notification created successfully!');
      setTimeout(function() {
         this.router.navigate(['./settings/notifications']);
      }.bind(this), 3000);

    })
  }

  handleError(e: any) {
      this.error = e;

      let detail = e.detail
      if(detail && detail == 'Signature has expired.'){
        this.router.navigate(['./login']);
      }
  }
}
