import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { SharedService } from '@shared/index';
import { URLSearchParams } from '@angular/http';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';

import {NgbModal, NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'task-list',
  templateUrl: './task-list.html'
})
export class TaskListComponent implements OnInit {

  taskLists: any = {};
  columns: Array<any> = [
    { title: 'Agent', name: 'agent__first_name', sort: true },
    { title: 'Task Type', name: 'task_type', sort: true },
    { title: 'Comment', name: 'comment', sort: false },
    { title: 'Customer',  name: 'customer', sort: false },
    { title: 'Status', className: ['text-center'], name: 'status', sort: false },
    { title: 'Source', className: ['text-center'], name: 'source', sort: false },
    { title: 'Created Date', name: 'datetime_created', sort: true },
    { title: 'Actions', className: ['text-center'], name: 'actions', sort: false }
];

  config: any = {
    paging: true,
    search: false,
    sorting: false,
    className: ['table-bordered']
  };

  loading: Boolean = true;
  taskId: any;
  showDialog = false;
  private modalRef: NgbModalRef;

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    // let params = new HttpParams();
    // params = params.append('limit', environment.tableRowLimit);
    // params = params.append('limitx', environment.tableRowLimit);
    let params = new URLSearchParams();
    params.set('limit', environment.tableRowLimit);
    this.getTasks(params);
  }

  getTasks(params: any) {
    this.loading = true;
    this.sharedService.getTasks(params).subscribe(
      (data) => {
        this.loading = false;
        this.taskLists = data;
      }
    );
  }
  close(event){
    console.log(event);
    //  this.modalRef.close();
  }
  onChangeTable(changedData) {
    let params = new HttpParams();

    let sortParam = '';
    this.columns.forEach(function(col, key) {
      if (col.sort) {
        if (col.sort === 'desc') {
          sortParam = sortParam !== '' ? sortParam + ',' + col.name  : '-' + col.name;
        } else if (col.sort === 'asc') {
          sortParam = sortParam !== '' ? sortParam + ',' + col.name  : col.name;
        }
      }
    });

    if (sortParam !== '') {
      params = params.append('ordering', sortParam);
    }

    if (changedData.search !== '') {
      params = params.append('search', changedData.search);
    }

    let start = (changedData.page - 1) * changedData.rows;
    start = start + 1;

    params = params.append('limit', changedData.rows);
    params = params.append('offset', start.toString());

    this.getTasks(params);
  }

  closeTask(req: any) {
    if (confirm('Are you sure you want to close this task?')) {
      const id = req.id;
      const values = {
        'status': 'completed'
      };
      this.sharedService.updateTask(id, values).subscribe(r => {
        let params = new HttpParams();
        params = params.append('limit', environment.tableRowLimit);
        this.getTasks(params);
        // jQuery('#assignTaskModal').modal('hide');
      });
    }
  }

  assignTask(id, content) {
    this.taskId = id;
    this.modalRef = this.modalService.open(content);
    // this.modalService.open(content)
    // $('#assignTaskModal').modal('show');
  }

  linkDetails(id, type) {
    if (type === 'development') {
      this.router.navigate(['./developments/edit/', id]);
    }
    if (type === 'order') {
      this.router.navigate(['./orders/edit/', id]);
    }
  }
}
