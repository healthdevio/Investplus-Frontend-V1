import { Component, OnInit, OnDestroy } from '@angular/core';
import { InvestorService } from '../core/service/investor.service';
import { EventEmitterService } from '../core/service/event-emitter-service.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];

  constructor(
    private investorService: InvestorService,
    private eventEmitter: EventEmitterService
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
}
