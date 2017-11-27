import { Component, OnInit } from '@angular/core';
import { SharedService } from '@shared/index';
@Component({
  selector: 'app-customer',
  template: '<router-outlet></router-outlet>'
})
export class CustomerComponent implements OnInit {

  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    const orderOptionsData = sessionStorage.getItem('orderOptions');
    if (!orderOptionsData) {
      this.sharedService.getOrderOptions().subscribe(response => {
        sessionStorage.setItem('orderOptions', JSON.stringify(response));
      });
    }
  }

}
