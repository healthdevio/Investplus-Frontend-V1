import { Component, OnInit } from '@angular/core';
import { InvestorService } from '../../../core/service/investor.service';
import { RoundService } from '../../../core/service/round.service';
import { CompanyService } from '../../../core/service/company.service';
import { InvestmentService } from '../../../core/service/investment.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-user-valuation',
  templateUrl: './admin-user-valuation.component.html',
  styleUrls: ['./admin-user-valuation.component.css']
})
export class AdminUserValuationComponent implements OnInit {

  companyId: number;
  roundId: number;
  investmentId: number;
  list = [];
  round: any;
  valuation: any;
  labels = [];
  investment: any;
  loader: boolean;

  constructor(
    private activedRouter: ActivatedRoute,
    private roundService: RoundService,
    private valuationService: CompanyService,
    private investorService: InvestorService,
    private investmentService: InvestmentService
  ) { }

  ngOnInit() {
    this.loader = true;
    this.activedRouter.params.subscribe(params => {
      this.companyId = params['id'];
      this.roundId = params['id2'];
      this.investmentId = params['id3'];
    });
    this.labels = [ 'Valuation atual', 'Valuation curto prazo', 'Valuation longo prazo' ];
    this.getRound();
  }

  private getRound(): void {
    this.roundService.getRound(this.companyId, this.roundId).subscribe((responseGetRound) => {
      this.round = responseGetRound;
      this.getInvestment(this.investmentId);
      this.getValuation();
      this.loader = false;
    });
  }

  private getValuation(): void {
    this.valuationService.getValuation(this.companyId).subscribe((responseGetValuation) => {
      this.list = [
        responseGetValuation.current,
        responseGetValuation.shortTerm,
        responseGetValuation.longTerm
      ];

      this.valuation = responseGetValuation;
    });
  }

  private getInvestment(id: number): void {
    this.investmentService.getInvestment(id).subscribe(
      (response) => {
        this.investment = response;
      });
  }

  public maskContract(contract: string): string {
    if (contract === null || contract === '') {
      return ' pendente';
    }
    return contract;
  }

}
