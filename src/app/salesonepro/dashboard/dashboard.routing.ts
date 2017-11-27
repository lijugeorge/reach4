import { Routes } from '@angular/router';

import { AuthGuard } from '@shared/index';
import { DashboardComponent } from './dashboard.component';

export const DashboardRouting: Routes = [
    {
      path: '',
      component: DashboardComponent,
      data: {
        breadcrumb: 'Dashboard'
      },
    },
  ];
