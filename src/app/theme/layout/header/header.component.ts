import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService, User } from '@shared/index';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  currentUser: User;
  public status: { isopen } = { isopen: false };

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  // dropdown buttons
  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  ngOnInit() {
    this.userService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData;
        console.log(userData)
        if(this.currentUser.avatar_thumbnail) {
            console.log("thumbnail exist")
        }
      }
    )
  }

  logout() {
    this.userService.purgeAuth();
    this.router.navigateByUrl('/login').then(() => {
      this.router.navigate(['/', 'login']);
    });
  }
}
