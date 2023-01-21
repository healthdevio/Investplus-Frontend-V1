import { LoaderService } from './../../../../core/service/loader.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../../../core/service/company.service';

declare var $: any;
declare var toastr: any;
declare var bootbox: any;

@Component({
  selector: 'app-round-approval-docs-details',
  templateUrl: './round-approval-docs-details.component.html',
  styleUrls: ['./round-approval-docs-details.component.css']
})
export class RoundApprovalDocsDetailsComponent implements OnInit {

  form: FormGroup;
  statusApproved: object;
  id: any;
  dataElement: any;
  docs: any;
  loading: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private companyService: CompanyService,
    private formBuilder: FormBuilder,
    private router: Router,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.getDocsInfo(id);
      this.id = id;
    }
  }

  getDocsInfo(id) {
    const $this = this;
    this.companyService.getDocsByCompany(id).subscribe((response) => {
      $this.docs = response;
    });
  }

  FieldsChange(value, id) {
    this.docs.forEach(elemento => {
      if (elemento.id === id) {
      }
    });
  }

  onSubmit() {
    const $this = this;
    this.loading = true;
    this.loaderService.load(this.loading);
    this.companyService.updateDocs(this.id, this.docs).subscribe(
      (response) => {
        $this.docs = response;
        const filterStatus = $this.docs.filter((obj) => obj.sent === false);
        if (filterStatus.length > 0) {
          bootbox.alert({
            title: 'Documentos atualizados',
            message: 'A documentação da empresa foi atualizada.',
          });
        } else {
          $this.updateStatusDocs();
        }
      }, (error) => {
        toastr.error('Ocorreu um erro, entre em contato com o administrador.', 'Erro');
      }, () => {
        this.loading = false;
        this.loaderService.load(this.loading);
      }
    );
  }

  updateStatusDocs() {
    const $this = this;
    this.statusApproved = { status: 'APPROVED' };
    this.companyService.updateStatus(this.id, this.statusApproved).subscribe(
      (response) => {
        bootbox.alert({
          title: 'Documentos aprovados',
          message: 'A documentação da empresa foi aprovada.',
        });
        $this.router.navigate(['/admin/rounds/approval/company/final']);
      }, (error) => {
        toastr.error('Ocorreu um erro, entre em contato com o administrador.', 'Erro');
      }
    );
  }

  verifyStatus(data) {
    data.forEach(elemento => {
      if (elemento.sent === false) {
        const aux = false;
      }
    });
    return true;
  }

}
