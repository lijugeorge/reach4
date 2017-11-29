import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TaskRouting } from './task.routing';

import { TaskComponent } from './task.component';
// import { TaskCreateComponent } from './create/task-create.component';
import { TaskListComponent } from './list/task-list.component';
import { NgbdModalComponent, NgbdModalContent } from './popup.component';
import {NgbModule, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
// import { DevelopmentService } from '../development/services/development.service';
import { UserService } from '@shared/index';

import {  SharedModule } from '../../shared/shared.module';
@NgModule({
  imports: [
    RouterModule.forChild(TaskRouting),
    NgbModule.forRoot(),
    SharedModule
  ],
  declarations: [
    TaskComponent,
    // TaskCreateComponent,
    TaskListComponent,
    NgbdModalComponent,
    NgbdModalContent
  ],
  providers: [
    // DevelopmentService,
    NgbActiveModal,
    UserService
  ],
  entryComponents: [ NgbdModalContent ]
})
export class TaskModule { }
