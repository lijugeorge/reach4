import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

import { UserService, SharedService } from '@shared/index';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  isAuthenticated: boolean;
  public brandPrimary = '#20a8d8';
  public brandSuccess = '#4dbd74';
  public brandInfo = '#63c2de';
  public brandWarning = '#f8cb00';
  public brandDanger = '#f86c6b';
  // sparkline charts

  public sparklineChartData1: Array<any> = [
    {
      data: [35, 23, 56, 22, 97, 23, 64],
      label: 'Clients'
    }
  ];
  public sparklineChartData2: Array<any> = [
    {
      data: [65, 59, 84, 84, 51, 55, 40],
      label: 'Clients'
    }
  ];

  public sparklineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public sparklineChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false,
      }],
      yAxes: [{
        display: false,
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: false
    }
  };
  public sparklineChartDefault: Array<any> = [
    {
      backgroundColor: 'transparent',
      borderColor: '#d1d4d7',
    }
  ];
  public sparklineChartPrimary: Array<any> = [
    {
      backgroundColor: 'transparent',
      borderColor: this.brandPrimary,
    }
  ];
  public sparklineChartInfo: Array<any> = [
    {
      backgroundColor: 'transparent',
      borderColor: this.brandInfo,
    }
  ];
  public sparklineChartDanger: Array<any> = [
    {
      backgroundColor: 'transparent',
      borderColor: this.brandDanger,
    }
  ];
  public sparklineChartWarning: Array<any> = [
    {
      backgroundColor: 'transparent',
      borderColor: this.brandWarning,
    }
  ];
  public sparklineChartSuccess: Array<any> = [
    {
      backgroundColor: 'transparent',
      borderColor: this.brandSuccess,
    }
  ];

  public sparklineChartLegend = false;
  public sparklineChartType = 'line';

  public columns: Array<any> = [
    {title: '#', name: 'id', className: ['text-center'], sort: false},
    {title: 'User', name: 'company_name'},
    {title: 'Country', name: 'default_contact__first_name', className: ['text-center'], sort: true},
    {title: 'Usage', name: 'default_contact__email', sort: true},
    {title: 'Payment Method', name: 'default_contact__phone', className: ['text-center'], sort: false},
    {title: 'Activity', name: 'is_important', sort: true},
  ];

  public config: any = {
    paging: true,
    search: true,
    sorting: true,
    className: ['table-bordered']
  };

  public customers: any = {};

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  constructor(
    private router: Router,
    private userService: UserService,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.userService.isAuthenticated.subscribe(
      (authenticated) => {
        this.isAuthenticated = authenticated;
      }
    );

    // Initialize Params Object
    let params = new HttpParams();
    params = params.append('limit', environment.tableRowLimit);

    this.userService.getCustomers(params).subscribe(
      (data) => {
        this.customers = data;
      }
    );
    // Get country
    this.sharedService.getCountryStateList().subscribe(response => {
      sessionStorage.setItem('countryStateList', JSON.stringify(response));
    });
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

    this.userService.getCustomers(params).subscribe(
      (responseData) => {
        this.customers = responseData;
      }
    );
  }

}
