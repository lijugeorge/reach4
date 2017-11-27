import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Navigation, UserService } from '@shared/index';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit {

	navigations: any = [];
  items: any = [];
  leftNavigation: any = {};
  loading: Boolean = true;
  constructor(public router: Router, private userService: UserService) { }

  ngOnInit() {
    if (!window.sessionStorage['navigation']) {
      this.loading = true;
      this.userService.getNavigation()
        .subscribe(navigations => {
          this.loading = false;
          this.buildNavigation(navigations);
      },
      err => {
        this.loading = false;
      });
    } else {
      const navigations = JSON.parse(window.sessionStorage['navigation']);
      //this.buildNavigation(navigations);
      this.loading = false;
    }
  }

  buildNavigation (navigations) {
		if(navigations.length > 0){
      navigations.forEach((item) => {
          var temp = {
                      path: this.slugify(item.title),
                      title: item.title,
                      order: item.sort_order,
                      children: []
                  };

          if(item.parent){
              if(!this.items[item.parent]){
                  this.items[item.parent] = {
                      path: '',
                      title: '',
                      order: '',
                      icon: '',
                      selected: false,
                      expanded: false,
                      children: []
                  }
              }

              this.items[item.parent].children.push(temp)
              this.items[item.parent].children.sort(this.GetSortOrder("order"));
          }
          else{
              if(!this.items[item.id]){
                  this.items[item.id] = {
                      path: '',
                      title: '',
                      order: '',
                      icon: '',
                      selected: false,
                      expanded: false,
                      children: []
                  };
              }
              this.items[item.id].path = this.slugify(item.title);
              this.items[item.id].title = item.title;
              this.items[item.id].order = item.sort_order;
              this.items[item.id].icon = item.hint;
          }

      });
      this.items.sort(this.GetSortOrder("order"));
	    window.sessionStorage['leftNavigation'] = JSON.stringify(this.items);
	    window.sessionStorage['navigation'] = JSON.stringify(navigations);
  	}
  }
  public slugify(s: string): any {
      if (!s) { return ''; }
      let ascii = [];
      let ch, cp;
      for (var i = 0; i < s.length; i++) {
        if ((cp = s.charCodeAt(i)) < 0x180) {
          ch = String.fromCharCode(cp);
          ascii.push(ch);
        }
      }
      s = ascii.join('');
      s = s.replace(/[^\w\s-]/g, '').trim().toLowerCase();

      return s.replace(/[-\s]+/g, '-');
  }

  public GetSortOrder(prop) {

      return function(a, b) {
          if (a.order > b.order) {
              return 1;
          } else if (a.order < b.order) {
              return -1;
          }
          return 0;
      }
  }
}
