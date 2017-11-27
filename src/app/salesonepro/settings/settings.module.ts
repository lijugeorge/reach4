import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SettingsRouting } from './settings.routing';
import { SettingsComponent } from './settings.component';
import { UsersComponent } from './users/users.component';
import { SharedModule } from '@shared/index';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(SettingsRouting),
  ],
  declarations: [
    SettingsComponent,
    UsersComponent
  ]
})
export class SettingsModule {}
