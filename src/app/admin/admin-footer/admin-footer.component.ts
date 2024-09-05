import { Component, OnInit } from "@angular/core";
import { UserLoginService } from "../../core/service/cognito/user-login.service";
import { Router } from "@angular/router";
import { EventEmitterService } from "../../core/service/event-emitter-service.service";
import { Investor } from "../../core/interface/investor";
import { Scopes } from "../../core/interface/scopes";
import { CognitoUtil } from "../../core/service/cognito/cognito.service";

@Component({
  selector: "app-admin-footer",
  templateUrl: "./admin-footer.component.html",
  styleUrls: ["./admin-footer.component.css"],
})
export class AdminFooterComponent implements OnInit {
  investor: Investor;
  getFirtLetter: any;
  scopes = new Scopes();
  scopesUser = [];

  constructor(
    private userService: UserLoginService,
    private router: Router,
    private cognitoUtil: CognitoUtil,
    private eventEmitter: EventEmitterService
  ) {}

  base64textString = "";

  ngOnInit() {
    const $this = this;
    const cognitoUser = this.cognitoUtil.getCurrentUser();
    if (cognitoUser != null) {
      cognitoUser.getSession(function (err, session) {
        if (session.isValid()) {
          const tokenId = session.getIdToken();
          const cognitoGroups = tokenId["payload"]["cognito:groups"];
          cognitoGroups.forEach((element) => {
            $this.scopesUser[element] = true;
          });
        }
      });
    }
    Object.assign(this.scopes, this.scopesUser);

    this.getUser();
  }

  // logout() {
  //   this.userService.logout();
  //   window.location.href = "https://investplus.vc";
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
}
