import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.html'
})
export class CustomerEditComponent implements OnInit {

  public error = {};
  public success = '';
  public customer: any;
  public page = 'edit';

  constructor(private router: Router, private route: ActivatedRoute,
    private customerService: CustomerService) {

  }
  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      const id = params['id'];
      this.customer = this.customerService.getCustomer(id);
    });
  }

  onSave(values: any) {
    this.customerService.save(values).subscribe(r => {
      this.success = 'Customer details updated successfully!';
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
    if (detail && detail === 'Signature has expired.') {
      this.router.navigate(['./login']);
    }
  }

}
