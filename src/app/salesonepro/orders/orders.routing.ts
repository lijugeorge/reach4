import { Routes } from '@angular/router';


import { OrdersComponent } from './orders.component';
import { OrdersListComponent } from './list/orders-list.component';

// import { AuthGuard  } from '../../guards/auth.guard';
// import { AccessGuard  } from '../../guards/access.guard';

export const ordersRouting: Routes = [
  {
    path: '',
    component: OrdersComponent,
    // canActivate: [AuthGuard, AccessGuard],
    children: [
      { path: '', component: OrdersListComponent },
      // { path: 'list', component: OrdersListComponent },
      // { path: 'edit/:id', loadChildren: () => System.import('./edit/orders-edit.module') }
    ]
  }
];
