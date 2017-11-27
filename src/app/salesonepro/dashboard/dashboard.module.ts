import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { DashboardRouting } from './dashboard.routing';
import { DashboardComponent } from './dashboard.component';
import { DashboardAuthResolver } from './dashboard-auth-resolver.service';
import { SharedModule } from '@shared/index';


@NgModule({
  imports: [
    RouterModule.forChild(DashboardRouting),
    SharedModule,
    ChartsModule
  ],
  declarations: [
    DashboardComponent,
  ],
  providers: [
    DashboardAuthResolver
  ]
})
export class DashboardModule {}
