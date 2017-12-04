import { Component, OnInit, ViewContainerRef } from '@angular/core';

import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { UserService } from "../services/user.service";
// import {LocalStorageService, SessionStorageService} from 'ng2-webstorage';

@Component({
  selector: 'user-edit',
  templateUrl: './user-edit.html'
})
export class UserEditComponent implements OnInit{

  public error = {};
	public success = '';
  public user: any;
  public page = 'edit';

	constructor(
    // private storage:LocalStorageService, 
    fb:FormBuilder, private router: Router, private route: ActivatedRoute,
    private userService: UserService,
    public toastr: ToastsManager,
    public vcr: ViewContainerRef
  ) {
    this.toastr.setRootViewContainerRef(vcr);
	}
	ngOnInit() {
      this.route.params.forEach((params: Params) => {
          let id = params['id'];
    			this.user = this.userService.getUser(id)
      });
	}

  onSave(values: any) {
    this.userService.save(values).subscribe(response =>  {
      this.toastr.success('User details updated successfully!');
      let currentUser = JSON.parse(sessionStorage.getItem('user'));
      if(response.id == currentUser.id){
        console.log(response)
         sessionStorage.setItem('user', JSON.stringify(response));
        //  this.storage.store('user', response);
      }
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

  private handleError(e: any) {
  	this.error = e;
      let detail = e.detail
      if(detail && detail == 'Signature has expired.'){
        this.router.navigate(['./login']);
      }
  }

}
