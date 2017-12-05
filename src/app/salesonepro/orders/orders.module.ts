import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ordersRouting } from './orders.routing';

import { OrdersComponent } from './orders.component';
import { OrdersListComponent } from './list/orders-list.component';

import { OrdersService } from './services/orders.service';
import { UserService } from '../settings/users/services/user.service';

import { SharedModule } from '@shared/index';

@NgModule({
  imports: [
    RouterModule.forChild(ordersRouting),
    SharedModule
  ],
  declarations: [
    OrdersComponent,
    OrdersListComponent,
  ],
  providers: [
    OrdersService,
    UserService
  ]
})
export class OrdersModule { }
