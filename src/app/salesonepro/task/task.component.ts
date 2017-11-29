import {Component, Input} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task',
  template: `<router-outlet></router-outlet>`
})
export class TaskComponent {
  constructor(private router: Router) {
  }
}
