import { Component, EventEmitter, Input, Output , OnInit, OnChanges} from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { SharedService } from "../../services/shared.service";
import { UserService } from "../../services/user.service";
declare var jQuery: any;
@Component({
  selector: 'assign-task',
  templateUrl: './assign-task.html'
})
export class AssignTaskComponent implements  OnInit, OnChanges{

  //@Input() success;
  @Input() relationId;
  @Input() page;
  @Input() taskId;
  @Input() modalRef;
  @Output() saved = new EventEmitter();
  public error = {};
  public success = '';

  public formSubmited = false;
  public taskForm:FormGroup;
  public taskOptions = [];
  public users = [];
  params: URLSearchParams = new URLSearchParams();

  public editor;
  public editorOptions = {
    modules: {
    },
    placeholder: "insert comments here..."
  };
  public taskComment: any;
  public taskAgent: any;
  public taskType: any;
  
	constructor(private fb:FormBuilder, private sharedService: SharedService, private router: Router
    , public userService: UserService) {
    this.taskForm = fb.group({
      'agent': ['', Validators.compose([Validators.required])],
      'task_type': [''],
      'relation_type': [],
      'relation_id': [],
      'comment': ['']
    });
  }

  ngOnInit() {
    this.getUsers();
    this.getTaskOptions();
    
    this.taskForm.controls['relation_id'].setValue(this.relationId);
    this.taskForm.controls['relation_type'].setValue(this.page);
  }
  ngOnChanges(){
    let parent = this;
    if(this.taskId){
      var agentName  = this.taskAgent;
      this.sharedService.getTask(this.taskId).subscribe(response => {
        this.userService.getUserInfoById(response.agent).subscribe(user => {
          agentName = user.first_name + ' ' + user.last_name;
          parent.taskAgent = agentName;
        });
        var typelist  = '';
        this.taskOptions.forEach(function(list){
          if(list.id == response.task_type){
            typelist = list.name;
          }
        })
         this.taskType = typelist;
        this.taskComment = response.comment;
      });
    }
    
  }

  closeModel(){
    if(this.modalRef){
      this.modalRef.close();
    }
  }
  

  getTaskOptions() {
    var data = sessionStorage.getItem('taskOptions');
    if(!data){
      this.sharedService.getTaskTypes().subscribe(response => {
        this.taskOptions = response.results;
        sessionStorage.setItem('taskOptions',JSON.stringify(response.results));
      });
    }
    else{
      this.taskOptions = JSON.parse(data);
    }
  }

  getUsers() {
    this.userService.getUsers(this.params).subscribe(response => {
      this.users = response.results;
    });
  }

  onSubmit(values: any) {
    this.formSubmited = true;
    if(this.taskForm.valid) {
    values.relation_id = this.relationId;
    values.relation_type = this.page;
      this.sharedService.saveTask(values).subscribe(response =>  {
        this.saved.emit(response);
        this.formSubmited = false;
        this.success = 'Task Assigned successfully!';
        this.closeModel();
        setTimeout(function() {
          this.success = '';
          this.taskForm.reset();
        }.bind(this), 3000);
      })
    }
    else{
      jQuery('form').find(':input.ng-invalid:first').focus();
    }
  }

  handleError(e: any) {
      this.error = e;
      let detail = e.detail
      if(detail && detail == 'Signature has expired.'){
        this.router.navigate(['./login']);
      }
  }
}
