import { TiposModalidades } from './../../../core/enums/modalidades.enum';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '../../../core/service/company.service';
import { RoundService } from '../../../core/service/round.service';
import { CompanyCaptableService } from '../../../core/service/company-captable.service';
import { CompanyFinancialService } from '../../../core/service/company-financial.service';
import { TitleHeader } from '../../../core/interface/title-header';
import { TitleService } from '../../../core/service/title.service';

@Component({
  selector: 'app-round-company-indicators',
  templateUrl: './round-company-indicators.component.html',
  styleUrls: ['./round-company-indicators.component.css']
})

export class RoundCompanyIndicatorsComponent implements OnInit {

  chart = [];
  round: any;
  companyId: any;
  roundId: any;
  labels = [];
  yAxes: string;
  investor: any;
  loader: boolean;
  model: string;
  displayCompany: boolean;
  titleHeader: TitleHeader;

  captable: any;
  financials: any;
  indicators: any;
  logo: string;
  name: string;

  dataRevenue = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  dataExpense = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  dataProfit = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  datas = [];
  datasLabel = [];

  constructor(private activedRouter: ActivatedRoute, private companyService: CompanyService, private roundService: RoundService, private captableService: CompanyCaptableService, private financialService: CompanyFinancialService, private data: TitleService) {}

  ngOnInit() {

    this.data.currentMessage.subscribe(titles => this.titleHeader = titles);
    this.titleHeader.title = 'Investimentos / Gestão de Indicadores';
    this.data.changeTitle(this.titleHeader);

    this.loader = true;

    this.activedRouter.params.subscribe(params => {
      this.companyId = params['id'];
      this.roundId = params['id2'];
    });

    this.datas = this.dateResume(new Date());
    this.getCompanyIndicators(this.companyId);
  }

  private getCompanyIndicators(id: number): void {
    this.companyService.getCompanyIndicators(id).subscribe((response) => {
      this.indicators = response;
      this.name = response.name;
      this.model = response.model;
      this.getCaptable(this.companyId);
    }, (error) => {
      this.getCaptable(this.companyId);
    });
  }

  private getCaptable(companyId): void {
    this.captableService.getCaptable(companyId).subscribe((response) => {
      this.captable = response;
      this.getCompanyFinancial();
    }, (error) => {
      this.getCompanyFinancial();
    });
  }

  private getCompanyFinancial(): void {

    this.financialService.getFinancial(this.companyId).subscribe((response) => {

      this.financials = response;
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

      for (const value of this.financials) {

        const dateFinal = new Date(value.date);
        dateFinal.setDate(dateFinal.getDate() + 1);

        const dataInvestment = months[dateFinal.getMonth()] + '/' + ((dateFinal.getFullYear()).toString()).substring(2, 4);
        const pos = this.datas.lastIndexOf(dataInvestment);

        if (pos >= 0) {
          this.dataRevenue[pos] = this.dataRevenue[pos] + value.revenueAmount;
          this.dataExpense[pos] = this.dataExpense[pos] + value.expenseAmount;
          this.dataProfit[pos] = this.dataRevenue[pos] - this.dataExpense[pos];
        }
      }
      this.getRound();
    }, (error) => {
      this.getRound();
    });
  }

  private getRound(): void {
    this.roundService.getShortRound(this.companyId, this.roundId).subscribe((responseGetRound) => {
      this.logo = responseGetRound.round.logo;
      this.loader = false;
    });
  }

  public lastMonth(date, diff): any {
    const d = new Date(date);
    d.setMonth(d.getMonth() + diff);
    return d;
  }

  public dateResume(data): any {
    const datas = [];
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    for (let i = 0; i < 12; i++) {
      const formatted_date = months[this.lastMonth(data, i * -1).getMonth()] + '/' + ((this.lastMonth(data, i * -1).getFullYear()).toString()).substring(2, 4);
      datas.push(formatted_date);
      this.datasLabel.push(formatted_date.toUpperCase());
    }
    this.datasLabel = this.datasLabel.reverse();
    return datas.reverse();
  }

  public maskModel(model: string): string {
    const aux = TiposModalidades[model];
    if (!aux) {
      return ""
    }

    return aux;
  }
}
