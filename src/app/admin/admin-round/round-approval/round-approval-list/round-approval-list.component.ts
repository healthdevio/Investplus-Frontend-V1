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
  status = 'APPROVED';
  loader: boolean;
  textRegister = 'Nenhum registro encontrado.';
  totalPages: number;
  itemsPerPage: number = 12;
  currentPage: number = 1;
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
    this.loadCompanies();
  }

  loadCompanies() {
    this.companies = [];
    this.getAllByStatus(this.status);
  }

  private getAllByStatus(status: any): void {
    this.loader = true;
    this.companyService.getAllByStatus(status).subscribe(
      (response) => {
        for (const company of response) {
          this.companies.push(company);
        }
        this.calculateTotalPages();
      });
    this.loader = false;
  }

  calculateTotalPages() {
    const totalCompanies = this.companies.length;
    this.totalPages = Math.ceil(totalCompanies / this.itemsPerPage);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  setStatus(newStatus: string) {
    this.status = newStatus;
    this.loadCompanies();
  }

  public maskModel(model: string): string {
    const aux = TiposModalidades[model];
    if (!aux) {
      return ""
    }

    return aux;
  }

}
