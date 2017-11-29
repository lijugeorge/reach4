import { Component, Input, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core'

import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" innerHTML="{{ header }}"></h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body" innerHTML="{{ content }}">
    </div><div #viewcontainer></div>
    <div class="modal-footer" innerHTML="{{ footer }}">
      <button type="button" class="btn btn-secondary" (click)="activeModal.close('Close click')">Close</button>
    </div>
  `
})
export class NgbdModalContent {
    @ViewChild('viewcontainer',{read:ViewContainerRef}) viewcontainer : ViewContainerRef;
    @Input() template : TemplateRef<any>;

    @Input() header = 'Hi';
    @Input() content;
    @Input() footer;
  constructor(public activeModal: NgbActiveModal) {
      
  }
}

@Component({
  selector: 'ngbd-modal-component',
  template: '<a  href="javascript:;" (click)="open()">{{displayText}}</a>'
})
export class NgbdModalComponent {
    @ViewChild('viewcontainer',{read:ViewContainerRef}) viewcontainer : ViewContainerRef;
    @Input() template : TemplateRef<any>;

    @Input() header;
    @Input() content;
    @Input() footer;
    @Input() displayText;
  constructor(private modalService: NgbModal) {}

  open() {
    const modalRef = this.modalService.open(NgbdModalContent);
    if(this.header){
        modalRef.componentInstance.header = this.header;
    }
    modalRef.componentInstance.content = this.content;
    modalRef.componentInstance.footer = this.footer;
  }
}