import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-customer-add',
  templateUrl: './customer-add.html',
})
export class CustomerAddComponent implements OnInit {

  public error = {};
  public success = '';
  public customer: any;
  public page = '';

  constructor(
    private router: Router,
    private customerService: CustomerService,
  ) { }

  ngOnInit() {
    this.page = 'add';
  }

  onSave(values: any) {
    this.customerService.save(values).subscribe(r => {
        this.success = 'Customer created successfully!';
        window.scrollTo(0, 0);
        setTimeout(function () {
          this.success = '';
          this.router.navigate(['./customers']);
        }.bind(this), 3000);
    },
    (error: any) => {
      this.handleError(error);
    })
  }

  private handleError(e: any) {
    this.error = e;
    const detail = e.detail
    if (detail && detail === 'Authentication credentials were not provided.') {
      this.router.navigate(['./login']);
    }
  }

}
