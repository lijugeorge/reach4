import { Routes } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { UsersComponent } from './users/users.component';

export const SettingsRouting: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Settings',
      status: false
    },
    children: [
      {
        path: 'users',
        component: UsersComponent,
        data: {
          breadcrumb: 'Users',
          status: true
        }
      }
    ]
  }
];
