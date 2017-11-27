import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  navigations: any = [];
  items: any = [];
  parentRoute = '';
  constructor(private router: Router, private route: ActivatedRoute) {
    const url: string = this.route.snapshot.firstChild.url.join('');
    this.parentRoute = url;
    if (window.sessionStorage['leftNavigation']) {
      this.items = JSON.parse(window.sessionStorage['leftNavigation']);
    }
  }

  ngOnInit() {
    this.router.events
    .filter(event => event instanceof NavigationEnd)
    .subscribe(event => {
      const url: string = this.route.snapshot.firstChild.url.join('');
      this.parentRoute = url;
      if (window.sessionStorage['leftNavigation']) {
        this.items = JSON.parse(window.sessionStorage['leftNavigation']);
      }
    });
  }

  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }

}
