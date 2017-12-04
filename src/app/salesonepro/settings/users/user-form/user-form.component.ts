import { Component, EventEmitter, Input, Output , OnInit} from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { CustomValidator } from '../../../../shared/custom-validator';
import { Router } from '@angular/router';

@Component({
  selector: 'user-form',
  templateUrl: './user-form.html'
})
export class UserFormComponent implements OnInit {

  @Input() user;
  @Input() error = {};
  @Input() page:string;
  @Output() saved = new EventEmitter();
  userForm:FormGroup;
  public userGroups = [];
  public success = '';
  public file = '';
  public loading: boolean;
  public formSubmited = false;
	constructor(private fb: FormBuilder,
    private userService: UserService, private router: Router) {

  }

  ngOnInit(): void {
    this.getUserGroups();
    this.buildForm();
  }

  buildForm() {
    this.userForm = this.fb.group({
          'id': [''],
          'first_name': ['', Validators.compose([Validators.required])],
          'last_name': [],
          'email': ['', Validators.compose([Validators.required, CustomValidator.email])],
          'password': this.page == 'add' ? ['', Validators.compose([Validators.required, Validators.minLength(8)])] : [''],
          'is_active': false,
          'avatar': [],
          'groups': ['', Validators.compose([Validators.required])],
        });
  }

  getUserGroups() {
    this.loading = true;
    this.userService.getUserGroups().subscribe(r =>  {
      this.userGroups = r.results;
      this.loading = false;
    })
  }

  ngOnChanges(change) {
    if (change.user && change.user.currentValue) {
      this.userForm.controls['id'].setValue(change.user.currentValue.id);
      this.userForm.controls['first_name'].setValue(change.user.currentValue.first_name);
      this.userForm.controls['last_name'].setValue(change.user.currentValue.last_name);
      this.userForm.controls['email'].setValue(change.user.currentValue.email);
      this.userForm.controls['is_active'].setValue(change.user.currentValue.is_active);
      this.userForm.controls['groups'].setValue(change.user.currentValue.groups);
    }
  }

  updated($event) {
    const files = $event.target.files || $event.srcElement.files;
    this.file = files[0];
  }

  onSubmit(validPost) {
    this.formSubmited = true;
    if(this.userForm.valid) {
      validPost.avatar = this.file;
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
