import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Scopes } from '../../core/interface/scopes';
import { CognitoUtil } from '../../core/service/cognito/cognito.service';
import { EventEmitterService } from '../../core/service/event-emitter-service.service';
import { Investor } from '../../core/interface/investor';
import { InvestorService } from '../../core/service/investor.service';

@Component({
  selector: 'app-admin-left-side',
  templateUrl: './admin-left-side.component.html',
  styleUrls: ['./admin-left-side.component.css']
})
export class AdminLeftSideComponent implements OnInit {
  @Output() sidebarToggle = new EventEmitter<boolean>();
  showDiv1: boolean = true;
  scopes = new Scopes;
  scopesUser = [];
  investor: Investor;
  base64textString = '';
  activeButton: string = 'start';
  isCollapsed = false;

  constructor(
    private cognitoUtil: CognitoUtil,
    private eventEmitter: EventEmitterService,
    private investorService: InvestorService,
  ) { }

  ngOnInit() {
    const $this = this;
    const cognitoUser = this.cognitoUtil.getCurrentUser();
    if (cognitoUser != null) {
      cognitoUser.getSession(function(err, session) {
        if (session.isValid()) {
          const tokenId = session.getIdToken();
          const cognitoGroups = tokenId['payload']['cognito:groups'];
          cognitoGroups.forEach(element => {
            $this.scopesUser[element] = true;
          });
        }
      });
    }
    Object.assign(this.scopes, this.scopesUser);
    this.getUser();
  }

  getUser() {
    this.eventEmitter.emitter.subscribe((response) => {
      if (response.name === 'get.user') {
        this.investor = response.data;
      }
    });

    // this.investorService.getUser().subscribe((response) => {
    //   this.base64textString = response.avatar === undefined ? './../../../assets/img/default-profile_01.png' : 'data:image/png;base64,' + response.avatar;
    // });
  }


  setActiveButton(buttonType: string) {
    this.activeButton = buttonType;
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleDivs() {
    this.showDiv1 = !this.showDiv1;
    this.sidebarToggle.emit(this.showDiv1);
  }
}
