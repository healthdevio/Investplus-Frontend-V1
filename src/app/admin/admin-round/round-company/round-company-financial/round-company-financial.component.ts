import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../../../core/service/company.service';
import { TitleService } from '../../../../core/service/title.service';
import { TitleHeader } from '../../../../core/interface/title-header';

@Component({
  selector: 'app-round-company-financial',
  templateUrl: './round-company-financial.component.html',
  styleUrls: ['./round-company-financial.component.css']
})
export class RoundCompanyFinancialComponent implements OnInit {

  titleHeader: TitleHeader;
  companies: any;
  status = 'APPROVED';
  loader: boolean;
  textRegister = 'Nenhum registro encontrado.';
  p = 1;
  responsive = true;
  labels: any = {
      previousLabel: 'Anterior',
      nextLabel: 'Próximo'
  };

  constructor(private companyService: CompanyService,
    private data: TitleService) { }

  ngOnInit() {
    this.getAllByStatus(this.status);
  }

  getAllByStatus(status) {
    this.data.currentMessage.subscribe(titles => this.titleHeader = titles);
    this.titleHeader.title = 'Administração / Receita e Despesa';
    this.data.changeTitle(this.titleHeader);
    this.loader = true;
    this.companyService.getAllByStatus(status).subscribe((response) => {
      this.companies = response;
      this.loader = false;
    });
  }

}
