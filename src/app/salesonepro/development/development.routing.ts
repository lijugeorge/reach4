import { Routes } from '@angular/router';

import { DevelopmentComponent } from './development.component';
import { DevelopmentCreateComponent } from './create/development-create.component';
import { DevelopmentEditComponent } from './edit/development-edit.component';
import { DevelopmentListComponent } from './list/development-list.component';
import { AuthGuard } from '@shared/index';

export const DevelopmentRouting: Routes = [
    {
      path: '',
      component: DevelopmentComponent,
      data: {
        breadcrumb: 'Development'
      },
      children: [
        {
          path: '',
          component: DevelopmentListComponent,
          data: {
            breadcrumb: 'List',
            status: true
          }
        },
        { path: 'create', component: DevelopmentCreateComponent },
        {
          path: 'edit/:id',
          component: DevelopmentEditComponent,
          data: {
            breadcrumb: 'Edit',
            status: true
          }
        }
      ]
    },
  ];
