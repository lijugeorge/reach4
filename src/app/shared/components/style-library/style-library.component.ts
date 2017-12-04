import { Component, EventEmitter, Input, Output , OnInit} from '@angular/core';
import { SharedService } from "../../services/shared.service";
import { Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { environment } from 'environments/environment';

@Component({
  selector: 'style-library',
  templateUrl: './style-library.html'
})
export class StyleLibraryComponent{

  @Input() success;
  @Input() buttonLabel;
  @Input() customer;
  @Input() development;
  @Input() order;
  @Input() reload;
  @Input() modalRef;
  @Output() saved = new EventEmitter();

  params: URLSearchParams = new URLSearchParams()
  columns: Array<any> = [
    {title: '', name: 'customer__company_name', sort: false},
    {title: 'RM#', name: 'id', sort: false},
    {title: 'STYLE NAME', name: 'program__name', sort: false},
    {title: 'ARTWORK APPROVAL DATE', name: 'datetime_created', sort: 'desc'},
    {title: 'ARTWORK STATUS', name: 'status__name', sort: false},
    {title: 'Actions', className: ['text-center'], name: 'actions', sort: false}
  ];

  config: any = {
    paging: true,
    search: true,
    sorting: true,
    limit: true,
    className: ['table-bordered']
  };

  public styleStatus = [];
  public start:number = 1;
  public page:number = 1;
  public itemsPerPage:number = 3;
  public maxSize:number = 5;
  public numPages:number = 2;
  public next = '';
  public allStylesLength = 0;
  public allStyles: any;
  public tableLoading = false;

	constructor(
    private sharedService: SharedService, 
    private router: Router
  ) {
    this.params.set('limit', environment.tableRowLimit);
    this.params.set('ordering', '-datetime_created');
  }

  ngOnInit() {
    this.getAllStyles(this.params);
    var data = sessionStorage.getItem('stylePriceOptions');
    if(data){
      let stylePriceOptions = JSON.parse(data);
      if(stylePriceOptions.status) {
        let parent = this;
        stylePriceOptions.status.forEach(function(col, key) {
          parent.styleStatus[col.id] = col.name
        });
      }
    }
  }

  ngOnChanges(){
    if(this.reload) {
      this.getAllStyles(this.params);
    }
  }

  getAllStyles(params: any) {
    params.set('order_id', this.order);
    params.set('development_id', this.development);
    params.set('customer', this.customer);
    this.tableLoading = true;
    this.sharedService.getStyles(params).subscribe(response => {
      this.allStyles = response;
      this.tableLoading = false;
    });
    
  }

  onSelectChange(event) {
    let changedValue = parseInt(event.target.value)

    if(this.next || (changedValue < this.itemsPerPage)){
      this.itemsPerPage =  event.target.value;
      let params = this.params;
      params.set('limit', event.target.value);
      this.getAllStyles(params);
    }
  }

  closeModel(){
    if(this.modalRef){
      this.modalRef.close();
    }
  }

  onChangeTable(changedData) {
    let params = this.params;

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
      params.set('ordering', sortParam);
    }

    if (changedData.search !== '') {
      params.set('search', changedData.search);
    }

    let start = (changedData.page - 1) * changedData.rows;
    start = start + 1;

    params.set('limit', changedData.rows);
    params.set('offset', start.toString());

    this.getAllStyles(params);
  }

  addToParent(style) {
    this.saved.emit(style);
  }

  handleError(e: any) {
      //this.error = e;
      let detail = e.detail
      if(detail && detail == 'Signature has expired.'){
        this.router.navigate(['./login']);
      }
  }
}
