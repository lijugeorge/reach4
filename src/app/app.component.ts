import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { UserService } from '@shared/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor (
    private userService: UserService,
    private translate: TranslateService
  ) {
    translate.addLangs(['en', 'fr']);
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  }

  ngOnInit() {
    this.userService.populate();
  }
}
