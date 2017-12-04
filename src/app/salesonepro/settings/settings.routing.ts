import { Routes } from '@angular/router';

import { SettingsComponent } from './settings.component';

import { UsersComponent } from './users/users.component';
import { UserListComponent } from './users/list/user-list.component';
import { UserAddComponent } from './users/add/user-add.component';
import { UserEditComponent } from './users/edit/user-edit.component';

import { NotificationListComponent } from './notification/list/notification-list.component';
import { NotificationAddComponent } from './notification/add/notification-add.component';
import { NotificationEditComponent } from './notification/edit/notification-edit.component';

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
        component: SettingsComponent,
        children: [
          { path: '', component: UserListComponent },
          { path: 'list', component: UserListComponent },
          { path: 'add', component: UserAddComponent },
          { path: 'edit/:id', component: UserEditComponent }
        ]
      },
      {
        path: 'notifications',
        component: SettingsComponent,
        children: [
          { path: '', component: NotificationListComponent },
          { path: 'list', component: NotificationListComponent },
          { path: 'add', component: NotificationAddComponent },
          { path: 'edit/:id', component: NotificationEditComponent }
        ]
      }
    ]
  }
];
