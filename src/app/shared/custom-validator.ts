import { FormControl, AbstractControl } from '@angular/forms';

export class CustomValidator {

  static email(control: FormControl) {

    // tslint:disable-next-line:max-line-length
    const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return EMAIL_REGEXP.test(control.value) ? null : {
      validateEmail: {
        valid: false
      }
    };
  }

  static whitespace(control: FormControl) {

    const pattern = /^[^-\s][a-zA-Z0-9_\s-]+$/;

    return pattern.test(control.value) ? null : {
      noWhitespace: {
        valid: false
      }
    };
  }

}
