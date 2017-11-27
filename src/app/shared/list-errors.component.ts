import { Component, Input } from '@angular/core';

import { Errors } from './models';

@Component({
  selector: 'list-errors',
  templateUrl: './list-errors.component.html'
})
export class ListErrorsComponent {
  formattedErrors: Array<string> = [];

  @Input()
  set errors(errorList: any) {
    this.formattedErrors = [];
    const parent = this;
    if (typeof errorList === 'object') {
      Object.keys(errorList).map(function(objectKey, index) {
        const value = errorList[objectKey];
          if (typeof errorList[objectKey] === 'string') {
            parent.formattedErrors.push(value);
          } else {
            if (value.length > 0) {
              parent.formattedErrors.push(value[0]);
            }
          }
      });
    } else {
      this.formattedErrors.push(errorList);
    }
    // console.log(errorList)
    // if (errorList.errors) {
    //   // tslint:disable-next-line:forin
    //   for (const field in errorList.errors) {
    //     this.formattedErrors.push(`${errorList.errors[field]}`);
    //   }
    // } else {
    //   console.log(typeof errorList)
    // }
  };

  get errorList() { return this.formattedErrors; }


}
