import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DevelopmentRouting } from './development.routing';
import { DevelopmentComponent } from './development.component';
import { DevelopmentCreateComponent } from './create/development-create.component';
import { DevelopmentEditComponent } from './edit/development-edit.component';
// import { DevelopmentFormComponent } from './Development-form/Development-form.component';
import { DevelopmentListComponent } from './list/development-list.component';
import { DevelopmentListingComponent } from './list/developments-list/development-listing.component';

import { DevelopmentService } from './services/development.service';
import { CustomerService } from "../customer/services/customer.service";
import { SharedModule } from '@shared/index';

@NgModule({
  imports: [
    RouterModule.forChild(DevelopmentRouting),
    SharedModule
  ],
  declarations: [
    DevelopmentComponent,
    DevelopmentCreateComponent,
    DevelopmentEditComponent,
    // CustomerFormComponent,
    DevelopmentListComponent,
    DevelopmentListingComponent
  ],
  providers: [
    DevelopmentService,
    CustomerService
  ]
})
export class DevelopmentModule { }
