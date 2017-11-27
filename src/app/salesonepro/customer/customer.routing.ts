import { Routes } from '@angular/router';

import { CustomerComponent } from './customer.component';
import { CustomerAddComponent } from './add/customer-add.component';
import { CustomerEditComponent } from './edit/customer-edit.component';
import { CustomerListComponent } from './list/customer-list.component';
import { AuthGuard } from '@shared/index';

export const CustomerRouting: Routes = [
    {
      path: '',
      component: CustomerComponent,
      data: {
        breadcrumb: 'Customers'
      },
      children: [
        {
          path: '',
          component: CustomerListComponent,
          data: {
            breadcrumb: 'List',
            status: true
          }
        },
        {
          path: 'add',
          component: CustomerAddComponent,
          data: {
            breadcrumb: 'Add',
            status: true
          }
        },
        {
          path: 'edit/:id',
          component: CustomerEditComponent,
          data: {
            breadcrumb: 'Edit',
            status: true
          }
        }
      ]
    },
  ];
