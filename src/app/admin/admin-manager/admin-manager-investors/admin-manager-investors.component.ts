import { Component, OnInit } from '@angular/core';
import { InvestorService } from '../../../core/service/investor.service';
import { ExcelService } from '../../../core/service/excel.service';
import { TitleHeader } from '../../../core/interface/title-header';
import { TitleService } from '../../../core/service/title.service';

@Component({
  selector: 'app-admin-manager-investors',
  templateUrl: './admin-manager-investors.component.html',
  styleUrls: ['./admin-manager-investors.component.css']
})
export class AdminManagerInvestorsComponent implements OnInit {

  titleHeader: TitleHeader;
  investors: any;
  totalInvestors: number;
  status = 'PENDING_EVALUATION';
  loader: boolean;
  textRegister = 'Nenhum registro encontrado.';
  p = 1;
  responsive = true;
  labels: any = {
      previousLabel: 'Anterior',
      nextLabel: 'Próximo'
  };

  constructor(private investorService: InvestorService, private excelService: ExcelService, private data: TitleService) { }

  ngOnInit() {
    this.getAllInvestors();
  }

  getAllInvestors() {
    this.loader = true;
    this.data.currentMessage.subscribe(titles => this.titleHeader = titles);
    this.titleHeader.title = 'Administração / Base de Investidores';
    this.data.changeTitle(this.titleHeader);

    this.investorService.getAllUsers(0, 1000).subscribe(
      (response) => {
        this.investors = response.content;
        this.totalInvestors = response.totalElements;
        this.loader = false;
      },
      (error) => {
        if (error.status === 500) {
          window.location.reload();
        } else {
          this.loader = false;
          console.error('An error occurred:', error);
        }
      }
    );
  }


  unmaskInput(input) {
    if (input === undefined) {
      return input;
    }
    return input.replace(/[^\d]+/g, '');
  }

  unmaskMoney(input) {
    if (input === undefined) {
      return input;
    }
    return (Number(input.replace(/[^\d]+/g, '')) / 100).toFixed(2);
  }

  exportAsXLSX(): void {
    const formattedInvestors = this.investors.map(investor => ({
      fullName: investor.fullName,
      email: investor.email,
      phone: investor.phone,
      cpf: investor.cpf,
      cnpj: investor.cnpj,
      rg: investor.rg,
      totalInvestedOthers: investor.totalInvestedOthers > 0 ? 'S' : 'N',
      created: new Date(investor.created).toLocaleDateString('pt-BR'),
    }));

    this.excelService.exportAsExcelFile(formattedInvestors, 'investors');
  }


}
