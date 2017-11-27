import { NgModule } from '@angular/core';

import {
  SharedModule,
} from '../shared';

import {
  FooterComponent,
  HeaderComponent,
  SidebarComponent,
  AsideComponent,
  BreadcrumbsComponent,
  NotfoundComponent,
  LayoutComponent,
  AsideToggleDirective,
  NAV_DROPDOWN_DIRECTIVES,
  SIDEBAR_TOGGLE_DIRECTIVES
} from './';

@NgModule({
  imports: [
  	SharedModule
  ],
  declarations: [
		FooterComponent,
		HeaderComponent,
		SidebarComponent,
		AsideComponent,
		BreadcrumbsComponent,
		NotfoundComponent,
		LayoutComponent,
		AsideToggleDirective,
		NAV_DROPDOWN_DIRECTIVES,
		SIDEBAR_TOGGLE_DIRECTIVES
  ],
  exports: [

  ]
})
export class ThemeModule {}
