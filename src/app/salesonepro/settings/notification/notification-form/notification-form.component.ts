import { Component, EventEmitter, Input, Output , OnInit} from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from "../services/notification.service";
import { CustomValidator } from '../../../../shared/custom-validator';
import { Router } from '@angular/router';

@Component({
  selector: 'notification-form',
  templateUrl: './notification-form.html'
})
export class NotificationFormComponent implements OnInit {

  @Input() notification;
  @Input() error = {};
  @Input() page:string;
  @Output() saved = new EventEmitter();
  notificationForm:FormGroup;
  public notificationTypes = [];
  public success = '';
  public file = '';
  public formSubmited = false;
  notificationTypeData = [];
  selectedNotificationType = [];
	constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService, 
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.getNotificationTypes();
    this.buildForm();
  }

  buildForm() {
    this.notificationForm = this.fb.group({
      'id': [''],
      'email': ['', Validators.compose([Validators.required, CustomValidator.email])],
      'notification_types': ['', Validators.compose([Validators.required])],
    });
  }

  getNotificationTypes() {
    this.notificationService.getNotificationTypes().subscribe(r =>  {
      this.notificationTypes = r.results;
    })
  }

  ngOnChanges(change) {
    if (change.notification && change.notification.currentValue) {
      this.notificationForm.controls['id'].setValue(change.notification.currentValue.id);
      this.selectedNotificationType = change.notification.currentValue.notification_types;
      this.notificationForm.controls['email'].setValue(change.notification.currentValue.email);
      if(change.notification.currentValue.notification_types.length) {
        var tt = this;
        change.notification.currentValue.notification_types.forEach(function(val) {
           tt.notificationTypeData.push(val)
        })
        this.notificationForm.controls['notification_types'].setValue(this.notificationTypeData);
      }
      else{
        this.notificationForm.controls['notification_types'].setValue('');
      }

    }
  }

  updateCheckedOptions(id, event) {

    if(event.target.checked){
      if(this.notificationTypeData.indexOf(id)== -1){
        this.notificationTypeData.push(id)
      }
    }
    else{
      this.notificationTypeData.splice(this.notificationTypeData.indexOf(id), 1);
    }

    this.notificationForm.controls['notification_types'].setValue(this.notificationTypeData.length == 0 ? '' : this.notificationTypeData);
  }

  onSubmit(validPost) {
    this.formSubmited = true;
    if(this.notificationForm.valid) {
      this.saved.emit(validPost);
    }
    else{
      // jQuery('form').find(':input.ng-invalid:first').focus();
    }
  }

  handleError(e: any) {
      this.error = e;
      let detail = e.detail
      if(detail && detail == 'Signature has expired.'){
        this.router.navigate(['./login']);
      }
  }
}
