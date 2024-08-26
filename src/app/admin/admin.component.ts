import { Component, OnInit, OnDestroy, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { InvestorService } from '../core/service/investor.service';
import { EventEmitterService } from '../core/service/event-emitter-service.service';
import { AdminHeaderComponent } from './admin-header/admin-header.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  @ViewChild('header', { static: true }) headerComponent: AdminHeaderComponent;

  sidebarExpanded = true;
  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];

  constructor(
    private investorService: InvestorService,
    private eventEmitter: EventEmitterService,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

  ngOnInit() {
    this.getUser();
    // add the the body classes
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');
  }

   ngOnDestroy() {
    // remove the the body classes
    this.body.classList.remove('skin-blue');
    this.body.classList.remove('sidebar-mini');
  }

  getUser() {
    const $this = this;
    this.investorService.getUser().subscribe((response) => {
      $this.eventEmitter.send({
        name: 'get.user',
        data: response
      });
    });
  }

  handleSidebarToggle(sidebarExpanded: boolean) {
    // Chama o método no AdminHeaderComponent
    this.headerComponent.adjustHeaderWidth(sidebarExpanded);
    
    // Chama o método no AdminComponent
    this.adjustContentWidth(sidebarExpanded);
  }

  adjustContentWidth(sidebarExpanded: boolean) {
    console.log("Admin componente", sidebarExpanded)
    this.sidebarExpanded = sidebarExpanded;
    this.updateContentStyle();
  }

  updateContentStyle() {
    const contentWrapperElement = this.el.nativeElement.querySelector('.content-wrapper');
    if (contentWrapperElement) {
      const marginLeft = this.sidebarExpanded ? '17.35%' : '6%';
      const width = this.sidebarExpanded ? 'calc(100% - 17.4%)' : 'calc(100% - 6%)';
      
      this.renderer.setStyle(contentWrapperElement, 'margin-left', marginLeft);
      this.renderer.setStyle(contentWrapperElement, 'width', width);
    }
  }
}
