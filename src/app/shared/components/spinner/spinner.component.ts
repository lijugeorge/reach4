import { Component, Input, OnDestroy, Inject, ViewEncapsulation } from '@angular/core';
import { Spinkit } from './spinkits';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError} from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: [
        './spinner.component.css',
        './spinkit-css/sk-double-bounce.css',
        './spinkit-css/sk-chasing-dots.css',
        './spinkit-css/sk-cube-grid.css',
        './spinkit-css/sk-rotating-plane.css',
        './spinkit-css/sk-spinner-pulse.css',
        './spinkit-css/sk-three-bounce.css',
        './spinkit-css/sk-wandering-cubes.css',
        './spinkit-css/sk-wave.css',
        './spinkit-css/sk-line-material.css'
    ],
    encapsulation: ViewEncapsulation.None
})
export class SpinnerComponent implements OnDestroy {
    public Spinkit = Spinkit;
    @Input() public backgroundColor = '#005173';
    @Input() public spinner = Spinkit.skLine;
    @Input() public type = 'route';
    @Input() public isSpinnerVisible = true;
    private sub: any;
    constructor(private router: Router, @Inject(DOCUMENT) private document: Document) {
      if (this.type === 'route') {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
              this.isSpinnerVisible = true;
            } else if ( event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
              this.isSpinnerVisible = false;
            }
        }, (error: any) => {
            this.isSpinnerVisible = false;
        });
      }
    }

    ngOnDestroy(): void {
        this.isSpinnerVisible = false;
    }
}
