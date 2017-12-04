import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { NotificationService } from "../services/notification.service";

@Component({
  selector: 'notification-edit',
  templateUrl: './notification-edit.html'
})
export class NotificationEditComponent implements OnInit{

  public error = {};
	public success = '';
  public notification: any;
  public page = 'edit';

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    public toastr: ToastsManager,
    public vcr: ViewContainerRef
  ) {
    this.toastr.setRootViewContainerRef(vcr);
	}
	ngOnInit() {
      this.route.params.forEach((params: Params) => {
          let id = params['id'];
    			this.notification = this.notificationService.getNotification(id)
      });
	}

  onSave(values: any) {
    this.notificationService.save(values).subscribe(response =>  {
      this.toastr.success('Notification details updated successfully!');
      setTimeout(function() {
         this.router.navigate(['./settings/notifications']);
      }.bind(this), 3000);
    })
  }

  private handleError(e: any) {
  	this.error = e;
      let detail = e.detail
      if(detail && detail == 'Signature has expired.'){
        this.router.navigate(['./login']);
      }
  }

}
