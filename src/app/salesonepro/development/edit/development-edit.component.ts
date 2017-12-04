import { Component, ViewEncapsulation, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup, AbstractControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import {NgbModal, NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

import { environment } from 'environments/environment';
import { SharedService } from '../../../shared/services/shared.service';
import { DevelopmentService } from "../services/development.service";
// import { OrdersService } from "../../orders/services/orders.service";

@Component({
  selector: 'development-edit',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './development-edit.html'
})
export class DevelopmentEditComponent implements OnInit{

  public error = {};
  public reload : boolean = false;
  public orderSuccess = '';
  public addDevStylesuccess = '';
  public styleError = [];
  public loading: boolean;
  public styleLoading: boolean;
  public developmentStyles = [];
  public developmentComments = [];
  public request = { 'id': '', 'status': {'id': ''}};
  public tabs:any = {development: '', id: ''};
  public developmentId = '';
  public customerId = '';
  public activeTabIndex = 0;
  developmentOptions = [];
  public styleStatus = [];
  public length = 0;
  public formSubmited = false;
  styleForm: FormGroup;
  commentForm: FormGroup;
  developmentForm: FormGroup;
  stylePriceOptions: any;
  selectedStyleIds = [];
  styleDetails = [];
  baseUrl = environment.api_url;
  token = localStorage.getItem('jwtToken');
  statusArr = [];
  public styleUrl = '';

  public editor;
  public editorOptions = {
    modules: {
    },
    placeholder: "insert comments here...",
  };

  public buttonLabel = 'Add To Development';
  public developmentStyleArray = [];

  params: URLSearchParams = new URLSearchParams()
  public rows:Array<any> = [];
  public columns:Array<any> = [
    {title: '', name: 'customer__company_name', sort: false},
    {title: 'RM#', name: 'id', sort: false},
    {title: 'STYLE NAME', name: 'program__name', sort: false},
    {title: 'ARTWORK APPROVAL DATE', name: 'datetime_created', sort: 'desc'},
    {title: 'ARTWORK STATUS', name: 'status__name', sort: false},
    {title: 'Actions', className: ['text-center'], name: 'actions', sort: false}
  ];

  public page:number = 1;
  public maxSize:number = 5;
  public numPages:number = 2;
  public next = '';
  public users = [];
  public popupLabel = 'Create';

  public showCloseDevelopmentForm:boolean = false;
  myDatePickerOptions = {
      todayBtnTxt: 'Today',
      dateFormat: 'mm/dd/yyyy',
      firstDayOfWeek: 'mo',
      sunHighlight: true,
      height: '30px',
      inline: false,
      disableUntil: {year: 2016, month: 8, day: 10},
      selectionTxtFontSize: '16px'
  };
  optionsModel: number[];
  // Settings configuration
  mySettings: IMultiSelectSettings = {
      dynamicTitleMaxItems: 2
  };

  private modalRef: NgbModalRef;
  
  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private developmentService: DevelopmentService,
    // private orderService: OrdersService, 
    // private configuration: Configuration
    private modalService: NgbModal,
    public toastr: ToastsManager,
    public vcr: ViewContainerRef
  ) {
    this.toastr.setRootViewContainerRef(vcr);
    this.params.set('limit', environment.tableRowLimit);
    this.params.set('ordering', '-datetime_created');
    // this.rows = configuration.rows;

    this.styleForm = fb.group({
      'id': [],
      'customer':[],
      'sku': ['', Validators.compose([Validators.required])],
      'style_type': ['', Validators.compose([Validators.required])],
      'customer_name': [],
      'name': [],
      'sizing': ['', Validators.compose([Validators.required])],
      'status': ['', Validators.compose([Validators.required])],
      'crown_fabric': ['', Validators.compose([Validators.required])],
      'visor_fabric': ['', Validators.compose([Validators.required])],
      'closure': ['', Validators.compose([Validators.required])],
      'color': ['', Validators.compose([Validators.required])],
      'embellishments': fb.array([
          this.initEmbellishmentForm()
       ])
    });

    this.developmentForm = fb.group({
      'id': [],
      'program': [''],
      'status': [''],
      'deadline': [''],
      'deadline_date': [''],
      'close_reason': [''],
      'note': ['']
    });

    this.commentForm = fb.group({
      'development': [''],
      'agent': [''],
      'comment': ['', Validators.compose([Validators.required])]
    });
	}

	ngOnInit() {
    this.route.params.forEach((params: Params) => {
      let id = params['id'];
      this.developmentId = id;
      this.getDevelopmentDetails(id);
      this.getDevelopmentStyles(id);
      this.getDevelopmentComments(id);
    });
    this.getDevelopmentOptions();

    var data = sessionStorage.getItem('stylePriceOptions');
    if(data){
      this.stylePriceOptions = JSON.parse(data);
      if(this.stylePriceOptions.status) {
        let parent = this;
        this.stylePriceOptions.status.forEach(function(col, key) {
          parent.styleStatus[col.id] = col.name
        });
      }
    }

	}

  getDevelopmentDetails(id) {
    this.loading = true;
    this.developmentService.getDevelopment(id).subscribe(response => {
      this.request = response
      this.customerId = response['customer'].id
      this.initDevelopmentFormFields(response);
      this.loading = false;
    });
  }

  initDevelopmentFormFields(developmentData) {
    this.statusArr.length = 0;
    if(developmentData.status.length > 0) {
      let parent = this;
      developmentData.status.forEach(function(row, i){
        parent.statusArr.push(row.id)
      });
    }
    this.developmentForm.controls['id'].setValue(developmentData.id);
    this.developmentForm.controls['program'].setValue(developmentData.program.id);
    this.developmentForm.controls['status'].setValue(this.statusArr);
    this.developmentForm.controls['deadline'].setValue(developmentData.deadline.id);
    this.developmentForm.controls['deadline_date'].setValue(developmentData.deadline_date);
    this.developmentForm.controls['note'].setValue(developmentData.note);
    this.developmentForm.controls['close_reason'].setValue(developmentData.close_reason);
  }

  changeStatus(event) {
    let options = event.target.options
    let selectedOptions = Array.apply(null,options)
      .filter(option => option.selected)
      .map(option => option.value);
    var cForm = this.developmentForm;
    (<FormGroup>cForm.controls['status']).setValue(selectedOptions);
  }

  onChange() {
    if(this.optionsModel && this.optionsModel.length > 0){
      var cForm = this.developmentForm;
      (<FormGroup>cForm.controls['status']).setValue(this.optionsModel);
    }
  }

  getDevelopmentStyles(id) {
    this.styleLoading = true;
    let param = this.params;
    param.set('ordering', 'id');
    param.delete('limit');
    this.developmentService.getDevelopmentStyles(id, param).subscribe(response => {
      this.styleLoading = false;
      this.developmentStyles = response;
      this.length = response.length
      let parent = this;
      if(response.length > 0) {
        response.forEach(function(col, key) {
          parent.developmentStyleArray.push(col.id)
        });
      }
      else{
        this.developmentStyleArray.length = 0;
      }
    });
  }

  getDevelopmentComments(id) {
    this.params.set('ordering', '-datetime_created');
    this.developmentService.getDevelopmentComments(id, this.params).subscribe(response => {
      this.developmentComments = response
    });
  }

  getDevelopmentOptions() {
    var data = sessionStorage.getItem('developmentOptions');
    if(!data){
      this.developmentService.getDevelopmentOptions().subscribe(response => {
        this.developmentOptions = response;
        sessionStorage.setItem('developmentOptions',JSON.stringify(response));
      });
    }
    else{
      this.developmentOptions = JSON.parse(data);
    }
  }

  updateCheckedOptions(option, style, event) {
    if(event.target.checked){
      let index = this.selectedStyleIds.indexOf(style.style.id);
      if(index <  0) {
        this.styleDetails[style.style.id] = style;
        this.selectedStyleIds.push(style.style.id);
      }
    }
    else{
      let index = this.selectedStyleIds.indexOf(style.style.id);
      this.selectedStyleIds.splice(index, 1);
    }

    //Style list for quick quote
    let styleList ;
    this.selectedStyleIds.forEach(function(styleId, i){
      if(styleList){
        styleList = styleList + 'styles=' + styleId + '&';
      }
      else{
        styleList = 'styles=' + styleId + '&';
      }

    });
    if(styleList){
      this.styleUrl = styleList;
    }

  }

  // createOrder() {
  //   this.styleLoading = true;
  //   let orderData = {
  //     "customer": this.request['customer'].id,
  //     "order_status": 1,
  //     "order_type": 1,
  //     "items": [],
  //     "development_id": this.developmentId
  //   };
  //   if(this.selectedStyleIds.length > 0) {
  //     let parent = this;
  //     let sizingOptions = [];
  //     sizingOptions[1] = ['OS'];
  //     sizingOptions[2] = ['S/M', 'L/XL'];
  //     sizingOptions[3] = ['7', '7-1/8', '7-1/4', '7-3/8', '7-1/2', '7-5/8', '7-3/4', '7-7/8', '8'];

  //     this.selectedStyleIds.forEach(function(styleId, i){
  //       if(sizingOptions[parent.styleDetails[styleId].style.sizing.id]) {
  //         sizingOptions[parent.styleDetails[styleId].style.sizing.id].forEach(function(size, key) {
  //           let styleData = {"style": styleId, "qty": 1, "size": size, "custom_style_number": parent.styleDetails[styleId].style.customer_name, "style_name": parent.styleDetails[styleId].style.name};
  //           orderData.items.push(styleData)
  //         });
  //       }
  //     });
  //   }
  //   this.orderService.save(orderData).subscribe(response =>  {
  //     jQuery('html, body').animate({scrollTop:0}, {duration: 1000});
  //     this.orderSuccess = 'Order created successfully!';
  //     this.styleLoading = false;
  //     setTimeout(function() {
  //       this.orderSuccess = '';
  //       this.router.navigate(['./admin/orders/edit/', response.id]);
  //     }.bind(this), 500);

  //   });
  // }

  addExistingStyle(content) {
    this.error = {};
    this.modalRef = this.modalService.open(content);
  }

  assignTask(content) {
    this.modalRef = this.modalService.open(content);
  }

  taskCreated() {
    this.getDevelopmentComments(this.developmentId);
  }

  addToDevelopment(style) {
    let developmentStyle = {'style': style.id, 'development': this.developmentId};
    this.developmentService.saveDevelopmentStyles(developmentStyle).subscribe(response => {
      this.getDevelopmentStyles(this.developmentId);
      this.reload = true;
      this.toastr.success('Style successfully added to development.');
      this.closeModel();
      setTimeout(function() {
        this.reload = false;
      }.bind(this), 1000);
    });
  }

  initEmbellishmentForm() {
    return this.fb.group({
      'id': [],
      'embellishment_type': ['', Validators.compose([Validators.required])],
      'data': ['']
    });
  }

  addEmbellishment() {
    const control = <FormArray>this.styleForm.controls['embellishments'];
    const addrCtrl = this.initEmbellishmentForm();
    control.push(addrCtrl);

    let index = control.controls.length - 1;
    var cForm = this.styleForm;
    (<FormGroup>(<FormGroup>cForm.controls['embellishments']).controls[index]).controls['data'].setValue('');
  }

  deleteEmbellishment(i) {
    if (confirm("Are you sure you want to delete this embellishment?")) {
      const control = <FormArray>this.styleForm.controls['embellishments'];
      control.removeAt(i);
      if(control.controls.length == 0) {
        this.addEmbellishment();
      }
    }
  }

  deleteDevelopmentStyle(devStyleId) {
    if (confirm("Are you sure you want to delete this style?")) {
      this.developmentService.deleteDevelopmentStyle(this.developmentId, devStyleId).subscribe(r =>  {
        this.getDevelopmentStyles(this.developmentId);
        this.reload = true;
        setTimeout(function() {
          this.reload = false;
        }.bind(this), 1000);
      });
    }
  }

  onDateChanged(event:any) {
    if(event.date &&  event.date.month && event.date.day && event.date.year) {
      let modified_date = event.date.month+'/'+event.date.day+'/'+event.date.year;
      this.developmentForm.controls['deadline_date'].setValue(modified_date);
    } else{
      this.developmentForm.controls['deadline_date'].setValue('');
    }
  }

  closeModel(){
    if(this.modalRef){
      this.modalRef.close();
    }
  }

  onDevelopmentFormSubmit(values: any) {
    if(this.developmentForm.valid) {
      this.error = {};
      this.developmentService.savePatch(this.developmentId, values).subscribe(response =>  {
        this.getDevelopmentDetails(this.developmentId);
        this.toastr.success('Development details saved successfully.');
        setTimeout(function() {
          this.showCloseDevelopmentForm = false;
        }.bind(this), 1000);
        if(this.showCloseDevelopmentForm)
          this.router.navigate(['./developments']);
      },
      (r: any) => {
        this.toastr.error('Please fill all required fields!');
        this.error = r;
      })
    }
  }

  onSubmit(values: any) {
    this.formSubmited = true;
    if(this.styleForm.valid) {
      this.error = {};
      values.style_group = values.sku;
      values.sku = values.sku + '-' +this.stylePriceOptions.color[(values.color)-1].name;
      this.developmentService.saveStyles(values).subscribe(response =>  {
        this.toastr.success('Style saved successfully.');
        this.formSubmited = false;
        this.selectedStyleIds = [];
        this.getDevelopmentStyles(this.developmentId);
        this.reload = true;
        if(this.popupLabel == 'Create') {
          this.addToDevelopment(response);
        }
        setTimeout(function() {
          this.closeModel();
          this.reload = false;
        }.bind(this), 1000);
      },
      (r: any) => {
        this.toastr.error('Please recheck the form values!');
        this.error = r;
      })
    }
    else{
      this.toastr.error('Please fill all required fields!');
    }
  }

  closeDevelopment() {
    if(!this.showCloseDevelopmentForm) {
      this.developmentForm.controls['status'].setValue([4]);
      this.showCloseDevelopmentForm = true;
    }
    else{
      this.developmentForm.controls['status'].setValue(this.request.status);
      this.showCloseDevelopmentForm = false;
    }
  }

  addNewComment(content) {
    this.popupLabel = 'Add';
    this.commentForm.reset();
    this.modalRef = this.modalService.open(content);
  }

  saveComment(values: any) {
    this.formSubmited = true;
    if(this.commentForm.valid) {
      let user = JSON.parse(sessionStorage.getItem('user'));

      values.development = this.developmentId;
      values.agent = user.id;
      this.developmentService.saveComments(values).subscribe(response =>  {
        this.toastr.success('Comment added successfully.');
        this.formSubmited = false;
        this.getDevelopmentComments(this.developmentId);
        setTimeout(function() {
          this.closeModel();
        }.bind(this), 1000);
      });
    }
  }

  createNewStyle(content) {
    this.popupLabel = 'Create';
    this.styleForm.reset();
    let style = [];
    this.setFormValue(style);
    this.error = {};
    this.formSubmited = false;
    this.styleForm.controls['status'].setValue('1');

    const control = <FormArray>this.styleForm.controls['embellishments'];
    control.controls.length = 1;
    this.modalRef = this.modalService.open(content);
  }

  editStyle(id, content) {
    this.error = {};
    this.popupLabel = 'Update';
    this.formSubmited = false;
    let parent = this;
    this.developmentStyles.forEach(function(col, key) {
      if(col.style.id == id) {
        parent.setFormValue(col.style);
        parent.modalRef = parent.modalService.open(content);
      }
    });
  }

  duplicateStyle(id, content) {
    this.error = {};
    this.popupLabel = 'Duplicate';
    this.formSubmited = false;
    let parent = this;
    this.developmentStyles.forEach(function(col, key) {
      if(col.style.id == id) {
        parent.setFormValue(col.style, 'duplicate');
        parent.modalRef = parent.modalService.open(content);
      }
    });
  }

  setFormValue(style, type= 'setForm') {
    if(style.id){
      this.styleForm.controls['id'].setValue(style.id);
    }
    this.styleForm.controls['sku'].setValue(style.style_group);
    this.styleForm.controls['customer'].setValue(this.request['customer'].id);

    this.styleForm.controls['style_type'].setValue(style.style_type ? style.style_type.id : '');
    this.styleForm.controls['sizing'].setValue(style.sizing ? style.sizing.id : '');
    this.styleForm.controls['customer_name'].setValue(style.customer_name ? style.customer_name : '');
    this.styleForm.controls['name'].setValue(style.name ? style.name : '');
    this.styleForm.controls['status'].setValue(style.status ? style.status.id : '');
    this.styleForm.controls['crown_fabric'].setValue(style.crown_fabric ? style.crown_fabric.id : '');
    this.styleForm.controls['visor_fabric'].setValue(style.visor_fabric ? style.visor_fabric.id : '');
    this.styleForm.controls['closure'].setValue(style.closure ? style.closure.id : '');
    this.styleForm.controls['color'].setValue(style.color ? style.color.id : '');
    if(type === 'duplicate'){
      this.styleForm.controls['id'].setValue('');
      this.styleForm.controls['color'].setValue('');
    }
    const control = <FormArray>this.styleForm.controls['embellishments'];
    if(control.controls.length > 1) {
      control.controls.length = 1;
    }

    var cForm = this.styleForm;
    if(style.embellishments){
      let parent = this
      style.embellishments.forEach(function(embellishment, key) {
        if(key > 0) {
          parent.addEmbellishment()
        }
       (<FormGroup>(<FormGroup>cForm.controls['embellishments']).controls[key]).controls['id'].setValue(embellishment.id);
       (<FormGroup>(<FormGroup>cForm.controls['embellishments']).controls[key]).controls['embellishment_type'].setValue(embellishment.embellishment_type ? embellishment.embellishment_type : '');
       (<FormGroup>(<FormGroup>cForm.controls['embellishments']).controls[key]).controls['data'].setValue(embellishment.data);
      });
    }
    else{
      (<FormGroup>(<FormGroup>cForm.controls['embellishments']).controls[0]).controls['embellishment_type'].setValue('');
      (<FormGroup>(<FormGroup>cForm.controls['embellishments']).controls[0]).controls['data'].setValue('');
    }
  }

  // updateStatus(status) {
  //   const temp = {};
  //   temp['status'] = status;
  //   this.developmentService.savePatch(this.request.id, temp).subscribe(r =>  {
  //     this.request.status.id = status;
  //   });
  // }

  // deleteStyle(i) {
  //   if (confirm("Are you sure you want to delete this style?")) {
  //     if(this.developmentStyles[i].id){
  //       this.developmentService.deleteDevelopmentStyle(this.developmentId, this.developmentStyles[i].id).subscribe(r =>  {
  //         this.activeTabIndex = 0;
  //         this.getDevelopmentStyles(this.developmentId);
  //       }).catch(r =>  {
  //         this.handleError(r);
  //       })
  //     }
  //     else{
  //       this.developmentStyles.splice(i, 1);
  //     }
  //   }
  // }

  onSelectChange(event, styleId) {
    let values ={};
    this.selectedStyleIds = [];
    this.developmentService.getStyle(styleId)
    this.developmentService.getStyle(styleId).subscribe(style => {
      if('approved_date' in style ){
        delete style.approved_date;
      }
      style.status = event.target.value;
      values = style;
      this.developmentService.saveStyles(values).subscribe(response =>  {
        this.getDevelopmentStyles(this.developmentId);
      },
      (r: any) => {
        this.error = r;
      })
    },
    (r: any) => {
      this.handleError(r);
    });

  }
  private handleError(e: any) {
    this.error = e;
    const detail = e.detail
    if(detail && detail == 'Signature has expired.'){
      this.router.navigate(['./login']);
    }
  }

}
