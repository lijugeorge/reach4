import { Component, OnInit, ViewEncapsulation, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { Errors, UserService } from '@shared/index';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  authType: String = '';
  title: String = '';
  errors: Errors = new Errors();
  isSubmitting = false;
  authForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private translate: TranslateService,
    private fb: FormBuilder,
    public toastr: ToastsManager,
    public vcr: ViewContainerRef
  ) {
    this.toastr.setRootViewContainerRef(vcr);
    translate.addLangs(['en', 'fr']);
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');

    // use FormBuilder to create a form group
    this.authForm = this.fb.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required],
      'grant_type': 'password',
    });
  }

  ngOnInit() {
    // this.toastr.success('You are awesome!', 'Success!');
    // this.toastr.error('This is not good!', 'Oops!');
    // this.toastr.warning('You are being warned.', 'Alert!');
    // this.toastr.info('Just some information for you.');
    // this.toastr.custom('<span style="color: red">Message in red.</span>', null, {enableHTML: true});
  }

  submitForm() {
    this.isSubmitting = true;
    this.errors = new Errors();
    if (this.authForm.valid) {
      const credentials = this.authForm.value;
      credentials.email = credentials.username;
      this.userService
      .attemptAuth(this.authType, credentials)
      .subscribe(
        data => this.router.navigateByUrl('/'),
        err => {
          this.errors = err;
          this.isSubmitting = false;
        }
      );
    }
  }
}
