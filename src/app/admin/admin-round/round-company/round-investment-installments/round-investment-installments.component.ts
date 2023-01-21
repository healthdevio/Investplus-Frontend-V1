import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvestmentService } from '../../../../core/service/investment.service';
import { TitleService } from '../../../../core/service/title.service';
import { TitleHeader } from '../../../../core/interface/title-header';

declare var $: any;
declare var toastr: any;

@Component({
  selector: 'app-round-investment-installments',
  templateUrl: './round-investment-installments.component.html',
  styleUrls: ['./round-investment-installments.component.css']
})
export class RoundInvestmentInstallmentsComponent implements OnInit {

  titleHeader: TitleHeader;
  investmentId: number;
  investment: any;
  loader: boolean;

  constructor(private router: Router, private data: TitleService, private activedRouter: ActivatedRoute, private investmentService: InvestmentService) { }

  ngOnInit() {

    this.data.currentMessage.subscribe(titles => this.titleHeader = titles);
    this.titleHeader.title = 'Administração / Detalhes do Investimento';
    this.data.changeTitle(this.titleHeader);

    this.activedRouter.params.subscribe(params => {
      this.investmentId = params['id'];
    });

    this.loader = true;
    this.getInvestment(this.investmentId);
  }

  private getInvestment(investment: number): void {
    this.investmentService.getInvestment(investment).subscribe(
      (response) => {
        this.investment = response;
        this.loader = false;
      }, (error) => {
          toastr.error('Erro ao buscar o investimento.');
    });
  }

  public updateStatus(investment): void {
    const contractId = ( <HTMLInputElement> document.getElementById('contractExternalId')).value;
    const statusInvestment = ( <HTMLInputElement> document.getElementById('status')).value;

    const status = { status: statusInvestment, contractExternalId: contractId };
    const $this = this;

    this.loader = true;

    this.investmentService.updateStatus(investment, status).subscribe(
      (response) => {
        toastr.success('Status atualizado.');
        $this.redirectTo('admin/rounds/company/investments/installment/' + investment);
      }, (error) => {
        this.loader = false;
        let errorMessage = 'Ocorreu um erro, entre em contato com o administrador.';

        if (error.error.code === 'ILLEGAL_ARGUMENT') {
          switch (error.error.message) {
            case 'Round must be finished':
              errorMessage = 'Rodada deve estar concluída.';
              break;
            case 'Invalid status':
              errorMessage = 'Status inválido.';
              break;
          }
        }
        toastr.error(errorMessage);
      });
  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/', {
      skipLocationChange: true
    }).then(() =>
      this.router.navigate([uri]));
  }

  unmaskInput(input) {
    if (input == null) {
      return '';
    }
    return input.replace(/[^\d]+/g, '');
  }

  unmaskMoney(input) {
    if (input == null) {
      return '';
    }
    return (Number(input.replace(/[^\d]+/g, '')) / 100).toFixed(2);
  }

}
