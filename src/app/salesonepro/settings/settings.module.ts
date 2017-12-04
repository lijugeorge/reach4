import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SettingsRouting } from './settings.routing';
import { SettingsComponent } from './settings.component';
import { UsersComponent } from './users/users.component';

import { UserListComponent } from './users/list/user-list.component';
import { UserService }  from './users/services/user.service';
import { UserAddComponent } from './users/add/user-add.component';
import { UserEditComponent } from './users/edit/user-edit.component';
import { UserFormComponent } from './users/user-form/user-form.component';

import { NotificationListComponent } from './notification/list/notification-list.component';
import { NotificationAddComponent } from './notification/add/notification-add.component';
import { NotificationEditComponent } from './notification/edit/notification-edit.component';
import { NotificationFormComponent } from
'./notification/notification-form/notification-form.component';

import { NotificationService }  from './notification/services/notification.service';


import { SharedModule } from '@shared/index';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(SettingsRouting),
  ],
  declarations: [
    SettingsComponent,
    UsersComponent,
    UserListComponent,
    UserAddComponent,
    UserEditComponent,
    UserFormComponent,
    NotificationListComponent,
    NotificationAddComponent,
    NotificationEditComponent,
    NotificationFormComponent
  ],
  providers: [
    UserService,
    NotificationService
  ]
})
export class SettingsModule {}
