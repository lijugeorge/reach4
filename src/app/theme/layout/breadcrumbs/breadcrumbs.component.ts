import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-breadcrumbs',
  template: `
  <ng-template ngFor let-breadcrumb [ngForOf]="breadcrumbs" let-last = last>
    <li class="breadcrumb-item"
        *ngIf="breadcrumb.title&&last"
        [ngClass]="{active: last}">
      <a *ngIf="!last" [routerLink]="breadcrumb.url">{{breadcrumb.title}}</a>
      <span *ngIf="last" [routerLink]="breadcrumb.url">{{breadcrumb.title}}</span>
    </li>
  </ng-template>`
})
export class BreadcrumbsComponent {
  breadcrumbs: Array<Object>;
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.router.events
    .subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.routeChanged(event);
      }
    });
  }

  public routeChanged(event: any) {
    // breadcrumb.title&&breadcrumb.url.substring(breadcrumb.url.length-1) == '/'||
    this.breadcrumbs = [];
    this.generateBreadcrumbTrail(this.router.routerState.root);
  }

  public generateBreadcrumbTrail(route: ActivatedRoute): void {
    route.children.forEach(childRoute => {

      if (childRoute.outlet === 'primary') {
        if (childRoute.snapshot.url.length > 0) {
          childRoute.snapshot.url.map(segment => {
            if (isNaN(parseInt(segment.path, 0))){
              let title = segment.path;
              title = title.replace(/-/g , ' ');
              this.breadcrumbs.push({'title': title, 'route': childRoute});
            }
          })
        }
        this.generateBreadcrumbTrail(childRoute);
      }
    });
  }

  public buildUrl(route: ActivatedRoute): string {
    let url = '';
    route.pathFromRoot.forEach((parentRoute: ActivatedRoute) => {
      if (parentRoute.snapshot.url.length > 0) {
        url += '/' + parentRoute.snapshot.url.map(segment => segment.path).join('/');
      }
    });
    return url;
  }
}
