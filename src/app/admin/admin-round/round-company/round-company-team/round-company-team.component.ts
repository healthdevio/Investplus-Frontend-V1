import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../../../core/service/company.service';
import { TitleService } from '../../../../core/service/title.service';
import { TitleHeader } from '../../../../core/interface/title-header';

@Component({
  selector: 'app-round-company-team',
  templateUrl: './round-company-team.component.html',
  styleUrls: ['./round-company-team.component.css']
})
export class RoundCompanyTeamComponent implements OnInit {

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

  constructor(private companyService: CompanyService, private data: TitleService) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(titles => this.titleHeader = titles);
    this.titleHeader.title = 'Administração / Equipe Executiva';
    this.data.changeTitle(this.titleHeader);
    this.getAllByStatus(this.status);
  }

  getAllByStatus(status) {
    this.loader = true;
    this.companyService.getAllByStatus(status).subscribe((response) => {
      this.companies = response;
      this.loader = false;
    });
  }

}
