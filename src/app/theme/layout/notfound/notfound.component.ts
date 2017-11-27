import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-notfound',
    templateUrl: './notfound.component.html'
})
export class NotfoundComponent implements OnInit {

    constructor(public router: Router) { }

    ngOnInit() {

    }

}
