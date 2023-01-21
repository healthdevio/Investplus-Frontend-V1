import { Component, OnInit } from "@angular/core";
import { CompanyService } from "../utils/service/company.service";
import { RoundsService } from "../utils/service/rounds.service";

declare var toastr: any;

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  company: any;
  labels: any;
  backgroundColor: any;
  data: any;
  loader: boolean;
  investors: any;
  config: object;
  options: object;

  constructor(
    private companyService: CompanyService,
    private roundsService: RoundsService
  ) {}

  ngOnInit() {
    this.getRound();
    this.getUsersInvestments();

    this.labels = ["Cotas investidas", "Cotas faltantes"];
    this.backgroundColor = ["#0e6a77", "#009dab"];
  }

  getRound() {
    this.loader = true;
    this.companyService.getInvestors().subscribe((response) => {
      this.company = response[0];
      const cotasRestantes =
        response[0].round.quotas - response[0].round.resume.quotasSold;
      this.data = [response[0].round.resume.quotasSold, cotasRestantes];
      this.loader = false;
    });
  }

  getUsersInvestments() {
    // this.roundsService.getUserInvestment(5).subscribe((response) => { // ambiente homologação
    this.roundsService.getUserInvestment(7).subscribe((response) => {
      // ambiente producao
      this.investors = response;
    });
  }
}
