import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import {Ng2Webstorage} from 'ngx-webstorage';

import { AppRoutes } from './app.routing';
import { ThemeModule } from './theme/theme.module';
import { AppComponent } from './app.component';


import {
  ApiService,
  AuthGuard,
  JwtService,
  SharedModule,
  UserService,
  SharedService,
} from './shared';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastModule.forRoot(),
    RouterModule.forRoot(AppRoutes, {useHash: true}),
    SharedModule,
    ThemeModule,
    Ng2Webstorage
  ],
  providers: [
    ApiService,
    AuthGuard,
    JwtService,
    UserService,
    SharedService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
