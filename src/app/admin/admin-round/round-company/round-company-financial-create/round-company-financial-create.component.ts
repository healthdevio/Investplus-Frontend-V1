import { LoaderService } from './../../../../core/service/loader.service';
import { DateMaskPipe } from './../../../../core/pipes/date-mask.pipe';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyFinancialService } from '../../../../core/service/company-financial.service';
import { TitleService } from '../../../../core/service/title.service';
import { TitleHeader } from '../../../../core/interface/title-header';

declare var $: any;
declare var toastr: any;
declare var bootbox: any;

@Component({
  selector: 'app-round-company-financial-create',
  templateUrl: './round-company-financial-create.component.html',
  styleUrls: ['./round-company-financial-create.component.css']
})
export class RoundCompanyFinancialCreateComponent implements OnInit {

  titleHeader: TitleHeader;
  form: FormGroup;
  loader: boolean;
  financials: any;
  company = 0;
  textRegister = 'Nenhum registro encontrado.';
  p = 1;
  responsive = true;
  labels: any = {
    previousLabel: 'Anterior',
    nextLabel: 'Próximo'
  };

  loading: boolean = false;

  constructor(
    private activedRouter: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private financialService: CompanyFinancialService,
    private data: TitleService,
    private dateMask: DateMaskPipe,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {

    this.data.currentMessage.subscribe(titles => this.titleHeader = titles);
    this.titleHeader.title = 'Administração / Receita e Despesa';
    this.data.changeTitle(this.titleHeader);

    this.loader = true;

    this.activedRouter.params.subscribe(params => {
      this.company = params['id'];
    });

    this.initForm();
    this.getCompanyFinancial();
    this.initMask();
  }

  initForm() {
    this.form = this.formBuilder.group({
      date: [null, [Validators.required]],
      revenueAmount: ['0,00', [Validators.required, Validators.minLength(3)]],
      expenseAmount: ['0,00', [Validators.required, Validators.minLength(3)]]
    });

    const $this = this;
    setTimeout(function () {
      $this.initMask();
    }, 1000);
  }

  unmaskMoney(input) {
    return (Number(input.replace(/[^\d]+/g, '')) / 100).toFixed(2);
  }

  initMask() {
    const SPMaskBehavior = function (val) {
      return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
    },
      spOptions = {
        onKeyPress: function (val, e, field, options) {
          field.mask(SPMaskBehavior.apply({}, arguments), options);
        }
      };
    $('.phone').mask(SPMaskBehavior, spOptions);
    $('.zipCode').mask('00000-000');
    $('.date').mask('00/00/0000');
    $('.money').mask('#.##0,00', {
      reverse: true
    });
    $('.number').keyup(function () {
      $(this).val(this.value.replace(/\D/g, ''));
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const dataSend = this.form.value;
      dataSend.date = this.dateMask.transform(dataSend.date, 'AMERICAN');
      dataSend.revenueAmount = this.unmaskMoney(dataSend.revenueAmount);
      dataSend.expenseAmount = this.unmaskMoney(dataSend.expenseAmount);

      this.loading = true;
      this.loaderService.load(this.loading);
      this.financialService.createFinancial(this.company, dataSend).subscribe((response) => {
        toastr.success('Dados enviados.');
        this.redirectTo('admin/rounds/company/financial/' + this.company);
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

  private getCompanyFinancial(): void {

    this.financialService.getFinancial(this.company).subscribe((response) => {
      this.financials = response;
      this.loader = false;
    }, (error) => {
      this.loader = false;
      toastr.error('Ocorreu um erro, contate o administrador.');
    });
  }

  private validateAllFields(formGroup: FormGroup) {
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

  public redirectTo(uri: string): void {
    this.router.navigateByUrl('/', {
      skipLocationChange: true
    }).then(() =>
      this.router.navigate([uri]));
  }

  validateDate() {
    const date = this.form.controls['date'].value;
    if (date !== null) {
      let ardt = new Array;
      const ExpReg = new RegExp('(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/[12][0-9]{3}');
      ardt = date.split('/');
      let erro = false;
      if (date.search(ExpReg) === -1) {
        erro = true;
      } else if (((ardt[1] === 4) || (ardt[1] === 6) || (ardt[1] === 9) || (ardt[1] === 11)) && (ardt[0] > 30)) {
        erro = true;
      } else if (ardt[1] === 2) {
        if ((ardt[0] > 28) && ((ardt[2] % 4) !== 0)) {
          erro = true;
        }
        if ((ardt[0] > 29) && ((ardt[2] % 4) === 0)) {
          erro = true;
        }
      }
      if (erro) {
        this.form.controls['date'].setValue('');
        bootbox.dialog({
          title: 'Campo incorreto',
          message: 'Insira uma data válida.',
          buttons: {
            ok: {
              label: 'Fechar',
              className: 'bg-upangel',
              callback: function () { }
            }
          }
        });
        return false;
      }
      return true;
    }
  }

}

