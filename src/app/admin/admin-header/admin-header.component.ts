import { Component, OnInit, Renderer2, ElementRef, ViewChild } from "@angular/core";
import { UserLoginService } from "../../core/service/cognito/user-login.service";
import { Router } from "@angular/router";
import { EventEmitterService } from "../../core/service/event-emitter-service.service";
import { Investor } from "../../core/interface/investor";
import { TitleService } from "../../core/service/title.service";
import { TitleHeader } from "../../core/interface/title-header";

@Component({
  selector: "app-admin-header",
  templateUrl: "./admin-header.component.html",
  styleUrls: ["./admin-header.component.css"],
})
export class AdminHeaderComponent implements OnInit {

  investor: Investor;
  getFirtLetter: any;
  sidebarExpanded = true;
  titleHeader: TitleHeader;

  constructor(
    private userService: UserLoginService,
    private router: Router,
    private eventEmitter: EventEmitterService,
    private data: TitleService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  base64textString = "";

  ngOnInit() {
    this.data.currentMessage.subscribe((titles) => (this.titleHeader = titles));
    this.getUser();
  }

  // logout() {
  //   this.userService.logout();
  //   window.location.href = "https://investplus.vc/";
  // }

  getUser() {
    this.eventEmitter.emitter.subscribe((response) => {
      if (response.name === "get.user") {
        this.investor = response.data;
        this.base64textString =
          response.data.avatar === undefined
            ? "./../../../assets/img/default-profile_01.png"
            : "data:image/png;base64," + response.data.avatar;
        this.getFirtLetter = response.data.nickname.charAt(0);
      }
    });
  }

  adjustHeaderWidth(sidebarExpanded: boolean) {
    console.log("header componente", sidebarExpanded)
    this.sidebarExpanded = sidebarExpanded;
    this.updateHeaderStyle();
  }

  updateHeaderStyle() {
    const headerElement = this.el.nativeElement.querySelector('.main-header nav');
    if (headerElement) {
      const marginLeft = this.sidebarExpanded ? '17.35%' : '6%';
      const width = this.sidebarExpanded ? 'calc(100% - 17.4%)' : 'calc(100% - 6%)';
      
      this.renderer.setStyle(headerElement, 'margin-left', marginLeft);
      this.renderer.setStyle(headerElement, 'width', width);
    }
  }


}
