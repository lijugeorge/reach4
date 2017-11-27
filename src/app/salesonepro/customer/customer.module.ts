import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CustomerRouting } from './customer.routing';
import { CustomerComponent } from './customer.component';
import { CustomerAddComponent } from './add/customer-add.component';
import { CustomerEditComponent } from './edit/customer-edit.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { CustomerListComponent } from './list/customer-list.component';

import { CustomerService } from './services/customer.service';
import { SharedModule } from '@shared/index';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  imports: [
    RouterModule.forChild(CustomerRouting),
    SharedModule,
    TextMaskModule
  ],
  declarations: [
    CustomerComponent,
    CustomerAddComponent,
    CustomerEditComponent,
    CustomerFormComponent,
    CustomerListComponent
  ],
  providers: [
    CustomerService
  ]
})
export class CustomerModule { }
