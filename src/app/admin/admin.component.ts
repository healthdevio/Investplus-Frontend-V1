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
  
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');
  
    this.adjustContentWidth(this.sidebarExpanded);
  
    window.addEventListener('resize', this.updateContentStyle.bind(this));
  
    this.updateContentStyle();
  }

  ngOnDestroy() {
    this.body.classList.remove('skin-blue');
    this.body.classList.remove('sidebar-mini');
    
    window.removeEventListener('resize', this.updateContentStyle.bind(this));
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
    this.headerComponent.adjustHeaderWidth(sidebarExpanded);
    
    this.adjustContentWidth(sidebarExpanded);
  }

  adjustContentWidth(sidebarExpanded: boolean) {
    this.sidebarExpanded = sidebarExpanded;
    this.updateContentStyle();
  }

  updateContentStyle() {
    const contentWrapperElement = this.el.nativeElement.querySelector('.content-wrapper');
    if (contentWrapperElement) {
      const windowWidth = window.innerWidth;
      
      if (windowWidth <= 768) {
        this.renderer.setStyle(contentWrapperElement, 'margin-left', '0');
        this.renderer.setStyle(contentWrapperElement, 'width', '100%');
      } else {
        const marginLeft = this.sidebarExpanded ? '17.35%' : '6%';
        const width = this.sidebarExpanded ? 'calc(100% - 17.4%)' : 'calc(100% - 6%)';
  
        this.renderer.setStyle(contentWrapperElement, 'margin-left', marginLeft);
        this.renderer.setStyle(contentWrapperElement, 'width', width);
      }
    }
  }
  
  
}
