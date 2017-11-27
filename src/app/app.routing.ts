import { Routes } from '@angular/router';

import {
  AuthGuard,
  coreRoute
} from '@shared/index';
import {
  LayoutComponent,
  SimpleLayoutComponent,
  NotfoundComponent
} from '@theme/layout/index';

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
  path: '',
  component: LayoutComponent,
  canActivate: [ AuthGuard ],
  children: [
    {
      path: 'dashboard',
      loadChildren: coreRoute.dashboard,
    },
    {
      path: 'customers',
      loadChildren: coreRoute.customer
    },
    {
      path: 'settings',
      loadChildren: coreRoute.settings
    },
  ]},
  {
    path: 'login',
    loadChildren: coreRoute.login,
  },
  {
    path: '404',
    component: NotfoundComponent,
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
