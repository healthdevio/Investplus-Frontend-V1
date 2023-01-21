import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../../../core/service/company.service';

@Component({
  selector: 'app-round-approval-docs',
  templateUrl: './round-approval-docs.component.html',
  styleUrls: ['./round-approval-docs.component.css']
})
export class RoundApprovalDocsComponent implements OnInit {

  companies: any;
  status = 'PENDING_DOCS';
  loader: boolean;
  textRegister = 'Nenhum registro encontrado.';
  p = 1;
  responsive = true;
  labels: any = {
      previousLabel: 'Anterior',
      nextLabel: 'Próximo'
  };

  constructor(
    private companyService: CompanyService
  ) { }

  ngOnInit() {
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
