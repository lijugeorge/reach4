import { Component, EventEmitter, Input, Output, OnInit, OnChanges, ViewEncapsulation } from '@angular/core';
import { FormGroup, AbstractControl, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { CustomerService } from '../services/customer.service';
import { CustomValidator, ScrollHelper } from '@shared/index';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.html',
  styleUrls: ['./customer-form.scss'],
})
export class CustomerFormComponent implements OnChanges {

  @Input() customer;
  @Input() error;
  @Input() page: string;
  @Output() saved = new EventEmitter();
  customerForm: FormGroup;
  public terms = [];
  public countryStateList: any;
  public sameAsShipping = false;
  public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  public loading: boolean;
  public formSubmited = false;
  credit_terms: any = [];
  orderOptions: any;
  private scrollHelper: ScrollHelper = new ScrollHelper();

  constructor(private fb: FormBuilder,
    private customerService: CustomerService, private router: Router) {

    this.customerForm = fb.group({
      'id': [''],
      'company_code': [null],
      'company_name': ['', Validators.compose([Validators.required, CustomValidator.whitespace])],
      'is_important': false,
      'credit_term': ['', Validators.compose([Validators.required])],
      'internal_notes': fb.array([]),
      'contacts': fb.array([
        this.initContacts(),
      ]),
      'shipping_addresses': fb.array([
        this.initShippingAddresses(),
      ]),
      'billing_addresses': fb.array([
        this.initBillingAddresses(),
      ]),
      'default_shipping': [],
      'default_billing': [],
      'default_contact': []
    });

    const cForm = this.customerForm;
    this.customerForm.get('shipping_addresses').valueChanges.subscribe( shippingData => {
      if (this.sameAsShipping) {
        (<FormArray>cForm.controls['billing_addresses']).setValue(shippingData);
      }
    });

    const orderOptionJson = sessionStorage.getItem('orderOptions');
    if (orderOptionJson) {
      this.orderOptions = JSON.parse(orderOptionJson);
    }
    const data = sessionStorage.getItem('countryStateList');
    if (data) {
      this.countryStateList = JSON.parse(data);
    }  else {
      this.countryStateList = {'countries': [], 'state': []};
    }

  }

  initContacts() {
    return this.fb.group({
      'id': [''],
      'first_name': ['', Validators.compose([Validators.required, CustomValidator.whitespace])],
      'last_name': [''],
      'department': [],
      'email': ['', Validators.compose([Validators.required, CustomValidator.email])],
      'phone': [''],
      'fax': [''],
      'is_default': false
    });
  }

  initShippingAddresses() {
    return this.fb.group({
      'id': [''],
      'name': [''],
      'street_1': [''],
      'street_2': [''],
      'city': [''],
      'state': [''],
      'state_text': [''],
      'country': ['US'],
      'zip': [''],
      'is_residential': false,
      'is_default': false
    });
  }

  initBillingAddresses() {
    return this.fb.group({
      'id': [''],
      'name': [''],
      'street_1': [''],
      'street_2': [''],
      'city': [''],
      'state': [''],
      'state_text': [''],
      'country': ['US'],
      'zip': [''],
      'is_residential': false,
      'is_default': false
    });
  }

  ngOnChanges(change) {
    this.loading = this.page === 'add' ? false : true;
    this.customerForm.controls['credit_term'].setValue('1');
    if (change.customer && change.customer.currentValue) {
      this.loading = false;
      this.customerForm.controls['id'].setValue(change.customer.currentValue.id);
      this.customerForm.controls['company_name'].setValue(change.customer.currentValue.company_name);
      this.customerForm.controls['company_code'].setValue(change.customer.currentValue.company_code);
      this.customerForm.controls['credit_term'].setValue(change.customer.currentValue.credit_term);
      // this.customerForm.controls['notes'].setValue(change.customer.currentValue.notes);

      const cForm = this.customerForm;
      const tt = this
      change.customer.currentValue.contacts.forEach(function (contact, key) {
        if (key > 0) {
          tt.addContact()
        }
        (<FormGroup>(<FormGroup>cForm.controls['contacts']).controls[key]).controls['id'].setValue(contact.id);
        (<FormGroup>(<FormGroup>cForm.controls['contacts']).controls[key]).controls['first_name'].setValue(contact.first_name);
        (<FormGroup>(<FormGroup>cForm.controls['contacts']).controls[key]).controls['last_name'].setValue(contact.last_name);
        (<FormGroup>(<FormGroup>cForm.controls['contacts']).controls[key]).controls['department'].setValue(contact.department);
        (<FormGroup>(<FormGroup>cForm.controls['contacts']).controls[key]).controls['email'].setValue(contact.email);
        (<FormGroup>(<FormGroup>cForm.controls['contacts']).controls[key]).controls['phone'].setValue(contact.phone);
        (<FormGroup>(<FormGroup>cForm.controls['contacts']).controls[key]).controls['fax'].setValue(contact.fax);
        (<FormGroup>(<FormGroup>cForm.controls['contacts']).controls[key]).controls['is_default'].setValue(contact.is_default);
      });

      change.customer.currentValue.shipping_addresses.forEach(function (shipping_address, key) {
        if (key > 0) {
          tt.addShippingAddress()
        }
        (<FormGroup>(<FormGroup>cForm.controls['shipping_addresses']).controls[key]).controls['id'].setValue(shipping_address.id);
        (<FormGroup>(<FormGroup>cForm.controls['shipping_addresses']).controls[key]).controls['name'].setValue(shipping_address.name);
        (<FormGroup>(<FormGroup>cForm.controls['shipping_addresses'])
        .controls[key]).controls['street_1'].setValue(shipping_address.street_1);
        (<FormGroup>(<FormGroup>cForm.controls['shipping_addresses'])
        .controls[key]).controls['street_2'].setValue(shipping_address.street_2);
        (<FormGroup>(<FormGroup>cForm.controls['shipping_addresses']).controls[key]).controls['city'].setValue(shipping_address.city);
        (<FormGroup>(<FormGroup>cForm.controls['shipping_addresses']).controls[key]).controls['state'].setValue(shipping_address.state);
        (<FormGroup>(<FormGroup>cForm.controls['shipping_addresses'])
        .controls[key]).controls['state_text'].setValue(shipping_address.state_text);
        (<FormGroup>(<FormGroup>cForm.controls['shipping_addresses']).controls[key]).controls['zip'].setValue(shipping_address.zip);
        (<FormGroup>(<FormGroup>cForm.controls['shipping_addresses']).controls[key])
        .controls['country'].setValue(shipping_address.country.code ? shipping_address.country.code : '');
        (<FormGroup>(<FormGroup>cForm.controls['shipping_addresses']).controls[key])
        .controls['is_residential'].setValue(shipping_address.is_residential);
        (<FormGroup>(<FormGroup>cForm.controls['shipping_addresses']).controls[key])
          .controls['is_default'].setValue(shipping_address.is_default);
      });

      change.customer.currentValue.billing_addresses.forEach(function (billing_address, key) {
        if (key > 0) {
          tt.addBillingAddress()
        }
        (<FormGroup>(<FormGroup>cForm.controls['billing_addresses']).controls[key]).controls['id'].setValue(billing_address.id);
        (<FormGroup>(<FormGroup>cForm.controls['billing_addresses']).controls[key]).controls['name'].setValue(billing_address.name);
        (<FormGroup>(<FormGroup>cForm.controls['billing_addresses']).controls[key]).controls['street_1'].setValue(billing_address.street_1);
        (<FormGroup>(<FormGroup>cForm.controls['billing_addresses']).controls[key]).controls['street_2'].setValue(billing_address.street_2);
        (<FormGroup>(<FormGroup>cForm.controls['billing_addresses']).controls[key]).controls['city'].setValue(billing_address.city);
        (<FormGroup>(<FormGroup>cForm.controls['billing_addresses']).controls[key]).controls['state'].setValue(billing_address.state);
        (<FormGroup>(<FormGroup>cForm.controls['billing_addresses']).controls[key]).controls['state_text']
        .setValue(billing_address.state_text);
        (<FormGroup>(<FormGroup>cForm.controls['billing_addresses']).controls[key]).controls['zip'].setValue(billing_address.zip);
        (<FormGroup>(<FormGroup>cForm.controls['billing_addresses']).controls[key]).controls['country']
        .setValue(billing_address.country.code);
        (<FormGroup>(<FormGroup>cForm.controls['billing_addresses']).controls[key]).controls['is_default']
        .setValue(billing_address.is_default);
      });

    } else {
      this.loading = false;
    }

  }

  addContact() {
    const control = <FormArray>this.customerForm.controls['contacts'];
    const addrCtrl = this.initContacts();
    control.push(addrCtrl);
  }

  deleteContact(i) {
    if (confirm('Are you sure you want to delete this contact?')) {
      const control = <FormArray>this.customerForm.controls['contacts'];
      control.removeAt(i);
    }
  }

  addShippingAddress() {
    const control = <FormArray>this.customerForm.controls['shipping_addresses'];
    const addrCtrl = this.initShippingAddresses();
    control.push(addrCtrl);
  }

  deleteShippingAddress(i) {
    if (confirm('Are you sure you want to delete this shipping address?')) {
      const control = <FormArray>this.customerForm.controls['shipping_addresses'];
      control.removeAt(i);
    }
  }

  addBillingAddress() {
    const control = <FormArray>this.customerForm.controls['billing_addresses'];
    const addrCtrl = this.initBillingAddresses();
    control.push(addrCtrl);
  }

  deleteBillingAddress(i) {
    if (confirm('Are you sure you want to delete this billing address?')) {
      const control = <FormArray>this.customerForm.controls['billing_addresses'];
      control.removeAt(i);
    }
  }

  updateCheckedOptions(key, event) {
    const cForm = this.customerForm;
    if (event.target.checked) {
      this.sameAsShipping = true;
      const shipping = this.customerForm.get('shipping_addresses');
      const billing = this.customerForm.get('billing_addresses');
      if (key in shipping.value) {
        // const control = (<FormGroup>(<FormGroup>cForm.controls['billing_addresses']).controls[key]).controls['id'];
        // let billing_id = control.value;
        // billing.setValue(shipping.value);
        (<FormGroup>(<FormGroup>cForm.controls['billing_addresses']).controls[key]).setValue(shipping.value[key]);
        (<FormGroup>(<FormGroup>cForm.controls['billing_addresses']).controls[key]).controls['id'].setValue('');
      }
    } else {
      this.sameAsShipping = false;
    }
  }

  isDefaultCheck(key, event, type) {
    if (event.target.checked) {
      const contactList = this.customerForm.get(type)['controls']
      contactList.forEach(function (data, i) {
        if (i !== key) {
          data.controls['is_default'].setValue(false)
        }
      });
    }
  }

  onSelectChange(event, key, type) {
    const cForm = this.customerForm;
    const changedValue = event.target.value;
    const control = (<FormGroup>(<FormGroup>cForm.controls[type]).controls[key]).controls['state'];
    if (changedValue !== 'US') {
      control.setValidators(null);
      control.updateValueAndValidity();
    } else {
      control.setValidators([Validators.required]);
      control.updateValueAndValidity();
    }
  }

  onSubmit(validPost) {
    this.formSubmited = true;
    if (this.customerForm.valid) {
      this.saved.emit(validPost);
    } else {
      this.scrollHelper.scrollToFirst('text-danger');
    }
  }
}
