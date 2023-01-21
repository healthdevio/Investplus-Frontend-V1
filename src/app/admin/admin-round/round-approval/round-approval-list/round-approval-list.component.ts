import { TiposModalidades } from './../../../../core/enums/modalidades.enum';
import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../../../core/service/company.service';
import { TitleService } from '../../../../core/service/title.service';
import { TitleHeader } from '../../../../core/interface/title-header';

@Component({
  selector: 'app-round-approval-list',
  templateUrl: './round-approval-list.component.html',
  styleUrls: ['./round-approval-list.component.css']
})
export class RoundApprovalListComponent implements OnInit {

  titleHeader: TitleHeader;
  companies = [];
  total = [];
  status = 'PENDING_EVALUATION';
  loader: boolean;
  textRegister = 'Nenhum registro encontrado.';
  p = 1;
  responsive = true;
  labels: any = {
      previousLabel: 'Anterior',
      nextLabel: 'Próximo'
  };

  constructor(
    private companyService: CompanyService,
    private data: TitleService
  ) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(titles => this.titleHeader = titles);
    this.titleHeader.title = 'Administração / Atualizar Dados';
    this.data.changeTitle(this.titleHeader);
    this.getAllByStatus(this.status);
    this.getAllByStatus('APPROVED');
  }

  private getAllByStatus(status: any): void {
    this.loader = true;
    this.companyService.getAllByStatus(status).subscribe(
      (response) => {

        for (const company of response) {
          this.companies.push(company);
        }

        this.loader = false;
      });
  }

  public maskModel(model: string): string {
    const aux = TiposModalidades[model];
    if (!aux) {
      return ""
    }

    return aux;
  }

}
