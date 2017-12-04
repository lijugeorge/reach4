import { Component, ElementRef, OnInit, Input, ViewContainerRef } from '@angular/core';
import { FormGroup, AbstractControl, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { CustomValidator } from '../../../shared/custom-validator';

import { CustomerService } from "../../customer/services/customer.service";
import { DevelopmentService } from "../services/development.service";
import { UserService } from '../../../shared/services/user.service';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
declare var jQuery: any
@Component({
  selector: 'development-create',
  templateUrl: './development-create.html'
})
export class DevelopmentCreateComponent implements OnInit {

  @Input() customersId;

  public error = {};
	public success = '';
  public users = [];
  public salesUsers = [];
  public loading: boolean = false;
  public deadlineDate = '';
  public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
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
  public formSubmited = false;
  public customerFormSubmited = false;
  public addCustomerLabel = false;
  developmentForm:FormGroup;
  params: URLSearchParams = new URLSearchParams();
  developmentOptions = [];
  selectedOptions = [];
  query: string = '';
  customersList: any[] = [];
  elementRef: ElementRef;
  pos: number = -1;
  opened: boolean = false;
  selectedItem: any;

  public editor;
  public editorOptions = {
    modules: {
    },
    placeholder: "insert comments here..."
  };
  orderOptions: any;
  optionsModel: number[];
  // Settings configuration
  mySettings: IMultiSelectSettings = {
      dynamicTitleMaxItems: 2
  };

  constructor(
    private fb:FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    public userService: UserService,
    public developmentService: DevelopmentService,
    public toastr: ToastsManager,
    public vcr: ViewContainerRef) {
      this.toastr.setRootViewContainerRef(vcr);
      var orderOptionJson = sessionStorage.getItem('orderOptions');
    if(orderOptionJson){
      this.orderOptions = JSON.parse(orderOptionJson);
    }
	}


  ngOnInit() {
    this.getUsers();
    this.getSalesUsers();
    this.getDevelopmentOptions();

    this.developmentForm = this.fb.group({
      'customer_type': ['1'],
      'customer_id': ['', Validators.compose([Validators.required])],
      'artwork_agent': ['', Validators.compose([Validators.required])],
      'sales_agent': ['', Validators.compose([Validators.required])],
      'program': ['1', Validators.compose([Validators.required])],
      'status': ['', Validators.compose([Validators.required])],
      'deadline': ['', Validators.compose([Validators.required])],
      'deadline_date': [null],
      'note': [''],
      'customer':  this.fb.group({
        'id': [''],
        'company_code': [null],
        'company_name': [''],
        'first_name': [''],
        'last_name': [''],
        'department': [],
        'email': [''],
        'phone': [''],
        'credit_term': [''],
      })
    });

    if(this.customersId){
        var cForm = this.developmentForm;
        (<FormGroup>cForm.controls['customer_id']).setValue(this.customersId);
    }
  }

  onChange() {
    var cForm = this.developmentForm;
    if(this.optionsModel && this.optionsModel.length > 0){
      (<FormGroup>cForm.controls['status']).setValue(this.optionsModel);
    }
    else{
      (<FormGroup>cForm.controls['status']).setValue(null);
    }
  }

  onDateChanged(event:any) {
    if(event.date &&  event.date.month && event.date.day && event.date.year) {
      this.deadlineDate = event.date.month+'/'+event.date.day+'/'+event.date.year;
      this.developmentForm.controls['deadline_date'].setValue(this.deadlineDate);
    }
    else{
      this.developmentForm.controls['deadline_date'].setValue(null);
    }
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

  getUsers() {
    this.params.set('group', '1,3');
    this.userService.getUsers(this.params).subscribe(response => {
      this.users = response['results']
    });
  }

  getSalesUsers() {
    this.params.set('group', '1,2');
    this.userService.getUsers(this.params).subscribe(response => {
      this.salesUsers = response['results']
    });
  }

  change(options) {
    this.selectedOptions = Array.apply(null,options)
      .filter(option => option.selected)
      .map(option => option.value);

    var cForm = this.developmentForm;
    (<FormGroup>cForm.controls['status']).setValue(this.selectedOptions);
  }

  onSubmit(values: any) {
    this.formSubmited = true;
    if(this.developmentForm.valid) {
      if(values.customer_type == 2){
        // New customer
        values.customer_obj = values.customer;
        values.customer = null;
      }
      else{
        //Existing customer
        values.customer = values.customer_id;
        values.customer_obj = null;
      }
      // console.log(values);
      this.loading = true;
      this.developmentService.save(values).subscribe(r =>  {
        this.loading = false;
        this.toastr.success('Development created successfully!');
        setTimeout(function() {
          this.router.navigate(['./developments']);
        }.bind(this), 1000);
      });
    }
    else{
      this.loading = false;
      this.toastr.error('Please fill all required fields!');
    }
  }

  addCustomer(event: any) {
    (<FormGroup>this.developmentForm.controls['customer_type']).setValue(event);
    if(event == 2){
      this.addCustomerLabel = true;

      const customerid = (<FormGroup>this.developmentForm.controls['customer_id']);
      customerid.setValidators(null);
      customerid.updateValueAndValidity();

      const firstname = (<FormGroup>this.developmentForm.controls['customer']).controls['first_name'];
      firstname.setValidators(Validators.compose([Validators.required, CustomValidator.whitespace]));
      firstname.updateValueAndValidity();

      const companyname = (<FormGroup>this.developmentForm.controls['customer']).controls['company_name'];
      companyname.setValidators(Validators.compose([Validators.required]));
      companyname.updateValueAndValidity();

      const email = (<FormGroup>this.developmentForm.controls['customer']).controls['email'];
      email.setValidators(Validators.compose([Validators.required, CustomValidator.email]));
      email.updateValueAndValidity();

      const creditterm = (<FormGroup>this.developmentForm.controls['customer']).controls['credit_term'];
      creditterm.setValidators(Validators.compose([Validators.required]));
      creditterm.updateValueAndValidity();
    }
    else{
      this.addCustomerLabel = false;

      (<FormGroup>this.developmentForm.controls['customer']).reset();
      const customerid = (<FormGroup>this.developmentForm.controls['customer_id']);
      customerid.setValidators(Validators.compose([Validators.required]));
      customerid.updateValueAndValidity();

      const companyname = (<FormGroup>this.developmentForm.controls['customer']).controls['company_name'];
      companyname.setValidators(null);
      companyname.updateValueAndValidity();

      const firstname = (<FormGroup>this.developmentForm.controls['customer']).controls['first_name'];
      firstname.setValidators(null);
      firstname.updateValueAndValidity();

      const email = (<FormGroup>this.developmentForm.controls['customer']).controls['email'];
      email.setValidators(null);
      email.updateValueAndValidity();

      const creditterm = (<FormGroup>this.developmentForm.controls['customer']).controls['credit_term'];
      creditterm.setValidators(null);
      creditterm.updateValueAndValidity();

    }
  }

  filterQuery() {
    this.params.set('search', this.query.toLowerCase());
    this.customerService.getCustomers(this.params).subscribe(response => {
      this.customersList = response['results'];
    });
  }


  filter(event: any) {

    this.query = event.target.value
    if (this.query !== '') {
      if (this.opened) {

        if ((event.keyCode >= 48 && event.keyCode <= 57) ||
          (event.keyCode >= 65 && event.keyCode <= 90) ||
          (event.keyCode == 8)) {

          this.pos = 0;
          this.filterQuery();

        } else if (event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 13) {
          //this.customersList = this.customers;
        }
      } else {
        this.filterQuery();
      }
    } else {
      if (this.opened) {
        //this.customersList = this.customers;
      } else {
        this.customersList = [];
      }
    }

    for (let i = 0; i < this.customersList.length; i++) {
      this.customersList[i].selected = false;
    }

    if (this.selectedItem) {
      this.customersList.map((i) => {
        if (i.id == this.selectedItem.id) {
          this.pos = this.customersList.indexOf(i);
        }
      })
      this.selectedItem = null;
    }

    // Arrow-key Down
    if (event.keyCode == 40) {
      if (this.pos + 1 != this.customersList.length)
        this.pos++;
    }

    // Arrow-key Up
    if (event.keyCode == 38) {
      if (this.pos > 0)
        this.pos--;
    }

    if (this.customersList[this.pos] !== undefined)
      this.customersList[this.pos].selected = true;

    //enter
    if (event.keyCode == 13) {
      if (this.customersList[this.pos] !== undefined) {
        this.select(this.customersList[this.pos], event);
      }
    }

    // Handle scroll position of item
    let listGroup = document.getElementById('list-group');
    let listItem = document.getElementById('true');
    if (listItem) {
      listGroup.scrollTop = (listItem.offsetTop - 200);
    }

  }

  select(item: any, event) {
    this.customersList = [];
    var cForm = this.developmentForm;
    jQuery('#autocomplete').val(item.company_name + ", " + item.default_contact.first_name + " " + item.default_contact.last_name);
    (<FormGroup>cForm.controls['customer_id']).setValue(item.id);
  }

  private handleError(e: any) {
  	this.error = e;
      let detail = e.detail
      if(detail && detail == 'Signature has expired.'){
        this.router.navigate(['./login']);
      }
  }

}
