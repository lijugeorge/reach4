import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
})
export class TableComponent implements OnInit, OnChanges {
    @Input() public columns: any;
    @Input() public config: any;
    @Input() public data: any;
    @Input() public totalResults: any;
    @Output() public tableChanged: EventEmitter<any> = new EventEmitter();

    rows = ['15', '30', '50', '100'];
    results = [];
    term = new FormControl();
    tableData = {
      'search': '',
      'rows': 15,
      'sort': '',
      'page': 1,
    };

    constructor() {
      this.term.valueChanges
          .debounceTime(400)
          .distinctUntilChanged()
          .subscribe(
          (data) => {
              this.onChangeTable(data, 'search');
          });
    }

    ngOnInit() { }
    ngOnChanges(change) {
        if (change.data && change.data.currentValue) {
            this.results = change.data.currentValue;
        }
    }

    onChangeTable (data, type) {
        if (type === 'sort' && data && data.sort !== false) {
            switch (data.sort) {
                case 'asc':
                    data.sort = 'desc';
                    break;
                case 'desc':
                    data.sort = '';
                    break;
                default:
                    data.sort = 'asc';
                    break;
            }
        } else if (type === 'paging') {
          this.tableData.page = data;
        } else if (type === 'row') {
          this.tableData.rows = data.target.value;
        } else if (type === 'search') {
          this.tableData.search = data;
        }
        const returnData = {
            'data': data,
            'type': type
        }
        this.tableChanged.emit(this.tableData);
    }
}
