import { Component, OnInit } from '@angular/core';
import { InvestmentInstallmentService } from '../../../../core/service/investment-installment.service';
import { ExcelService } from '../../../../core/service/excel.service';
import { ActivatedRoute } from '@angular/router';
import { TitleService } from '../../../../core/service/title.service';
import { TitleHeader } from '../../../../core/interface/title-header';

@Component({
  selector: 'app-round-investment-installments-details',
  templateUrl: './round-investment-installments-details.component.html',
  styleUrls: ['./round-investment-installments-details.component.css']
})
export class RoundInvestmentInstallmentsDetailsComponent implements OnInit {

  titleHeader: TitleHeader;
  investmentId: number;
  installments: any;
  description = '';
  response: any;
  loader: boolean;
  errorMessage = '';
  responseError: boolean;
  textRegister = 'Nenhum registro encontrado.';
  p = 1;
  responsive = true;
  labels: any = {
      previousLabel: 'Anterior',
      nextLabel: 'Próximo'
  };

  constructor(private activedRouter: ActivatedRoute, private data: TitleService, private investmentInstallmentService: InvestmentInstallmentService, private excelService: ExcelService) { }

  ngOnInit() {

    this.data.currentMessage.subscribe(titles => this.titleHeader = titles);
    this.titleHeader.title = 'Administração / Parcelas do Investimento';
    this.data.changeTitle(this.titleHeader);

    this.activedRouter.params.subscribe(params => {
      this.investmentId = params['id'];
    });

    this.loader = true;
    this.responseError = false;
    this.investmentInstallmentService.getInstallments(this.investmentId).subscribe(
      (response) => {
        this.installments = response;
        this.loader = false;
      }, (error) => {
        this.loader = false;
    });
  }

  public exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.installments, 'investors');
  }

  public maskStatus(input): any {
    if (input == null) {
      return '';
    }
    let status = '';
    switch (input) {
      case 'PENDING':
        status = 'Pendente';
        break;
      case 'PAID':
        status = 'Pago';
        break;

    }
    return status;
  }

}
