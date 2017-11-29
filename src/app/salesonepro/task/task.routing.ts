import { Routes } from '@angular/router';

import { TaskComponent } from './task.component';
// import { TaskCreateComponent } from './create/task-create.component';
import { TaskListComponent } from './list/task-list.component';

export const TaskRouting: Routes = [
  {
    path: '',
    component: TaskComponent,
    children: [
      { path: '', component: TaskListComponent },
      // { path: 'create', component: TaskCreateComponent }
    ]
  }
];
