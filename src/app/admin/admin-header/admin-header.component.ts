import { Component, OnInit } from "@angular/core";
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
  titleHeader: TitleHeader;

  constructor(
    private userService: UserLoginService,
    private router: Router,
    private eventEmitter: EventEmitterService,
    private data: TitleService
  ) {}

  base64textString = "";

  ngOnInit() {
    this.data.currentMessage.subscribe((titles) => (this.titleHeader = titles));
    this.getUser();
  }

  logout() {
    this.userService.logout();
    window.location.href = "https://fcjinvest.com/";
  }

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
}
