import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { UserService } from "../services/user.service";

@Component({
  selector: 'user-add',
  templateUrl: './user-add.html'
})
export class UserAddComponent implements OnInit{

  public userGroups = [];
  public success = '';
  public error = {};
  public page = '';

  constructor(fb:FormBuilder, 
    private router: Router,
    private userService: UserService,
    public toastr: ToastsManager,
    public vcr: ViewContainerRef
  ) {
    this.toastr.setRootViewContainerRef(vcr);
	}
  ngOnInit() {
    this.page = 'add';
  }

  onSave(values: any) {
    this.userService.save(values).subscribe(r =>  {
      this.toastr.success('User created successfully!');
      setTimeout(function() {
         this.router.navigate(['./settings/users']);
      }.bind(this), 3000);

    },
    (r: any) => {
      let msg = 'Please fill all required fields!';
      if(r && r.detail){
        msg = r.detail;
      }
      this.toastr.error(msg);
      this.error = r;
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
