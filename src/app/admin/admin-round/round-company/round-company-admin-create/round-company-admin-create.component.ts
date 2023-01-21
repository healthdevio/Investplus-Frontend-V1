import { LoaderService } from './../../../../core/service/loader.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CompanyService } from '../../../../core/service/company.service';
import { TitleService } from '../../../../core/service/title.service';
import { TitleHeader } from '../../../../core/interface/title-header';

declare var toastr: any;

@Component({
  selector: 'app-round-company-admin-create',
  templateUrl: './round-company-admin-create.component.html',
  styleUrls: ['./round-company-admin-create.component.css']
})
export class RoundCompanyAdminCreateComponent implements OnInit {

  titleHeader: TitleHeader;
  form: FormGroup;
  loader: boolean;
  company = 0;
  loading: boolean = false;

  constructor(private activedRouter: ActivatedRoute,
    private formBuilder: FormBuilder,
    private data: TitleService,
    private companyService: CompanyService,
    private loaderService: LoaderService
    ) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(titles => this.titleHeader = titles);
    this.titleHeader.title = 'Administração / Administradores';
    this.data.changeTitle(this.titleHeader);
    this.activedRouter.params.subscribe(params => {
      this.company = params['id'];
    });

    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      userName: [null, [Validators.required]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const dataSend = this.form.value;
      this.loading = true;
      this.loaderService.load(this.loading);
      this.companyService.createAdmin(this.company, dataSend).subscribe((response) => {
        toastr.success('Administrador atualizado.');
        this.form.reset();
      }, (error) => {
        toastr.error('Ocorreu um erro, contate o administrador.');
      }, () => {
        this.loading = false;
        this.loaderService.load(this.loading);
      });
    } else {
      this.validateAllFields(this.form);
      toastr.error('Formulário preenchido incorretamente. Por favor revise seus dados.');
    }
  }

  validateAllFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({
          onlySelf: true
        });
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control);
      }
    });
  }

}
