import { Component, OnInit } from '@angular/core';
import { SharedService } from '@shared/index';
@Component({
  selector: 'app-development',
  template: '<router-outlet></router-outlet>'
})
export class DevelopmentComponent implements OnInit {

  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit() { }

}
