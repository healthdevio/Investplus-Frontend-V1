import { LoaderService } from './../../../../core/service/loader.service';
import { DateMaskPipe } from './../../../../core/pipes/date-mask.pipe';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { RadioOption } from '../../../../share/radio/radio-option.model';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '../../../../core/service/company.service';
import { Router } from '@angular/router';
import { Address } from '../../../../core/interface/address';
import { Responsible } from '../../../../core/interface/responsible';
import { UserService } from '../../../../core/service/user.service';
import { TitleService } from '../../../../core/service/title.service';
import { TitleHeader } from '../../../../core/interface/title-header';

declare var $: any;
declare var toastr: any;
declare var bootbox: any;


@Component({
  selector: 'app-round-approval-create',
  templateUrl: './round-approval-create.component.html',
  styleUrls: ['./round-approval-create.component.css']
})
export class RoundApprovalCreateComponent implements OnInit {

  titleHeader: TitleHeader;
  form: FormGroup;
  emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  yearValidator = 'Ano de constituição é um campo obrigatório';
  textValidator = ' é obrigatório.';
  address: Address;
  responsible: Responsible;
  id: number;
  loading: boolean = false;

  contractModel: RadioOption[] = [{
    label: 'Contrato em notas conversíveis para transformação de S/A',
    value: 'INVESTMENT',
    span: ''
  },
  {
    label: 'Sociedade conta participação de forma efetiva ',
    value: 'PARTICIPATION',
    span: ''
  }
  ];

  hasDividends: RadioOption[] = [{
    label: 'Sim',
    value: true,
    span: ''
  },
  {
    label: 'Não',
    value: false,
    span: ''
  }
  ];

  model: RadioOption[] = [{
    label: 'Startup',
    value: 'STARTUP',
    span: ''
  },
  {
    label: 'Empresa tradicional',
    value: 'TRADITIONAL',
    span: ''
  }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private activedRouter: ActivatedRoute,
    private companyService: CompanyService,
    private router: Router,
    private userService: UserService,
    private data: TitleService,
    private dateMask: DateMaskPipe,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(titles => this.titleHeader = titles);
    this.titleHeader.title = 'Administração / Cadastrar Empresa';
    this.data.changeTitle(this.titleHeader);
    this.initForm();
    this.initMask();
  }

  public onSubmit(): void {
    // const date = this.dateMask.transform(this.form.value.responsible.dateOfBirth, 'AMERICAN');
    // console.log('[date]', date);
    // return;
    this.loading = true;
    this.loaderService.load(this.loading);
    if (this.form.valid) {

      const data = this.form.value;

      data.cnpj = this.unmaskCnpj(data.cnpj);
      data.totalExpenditure = this.unmaskCurrency(data.totalExpenditure);
      data.cac = this.unmaskCurrency(data.cac);
      data.averageTicket = this.unmaskCurrency(data.averageTicket);
      data.ltv = this.unmaskCurrency(data.ltv);
      data.cmv = this.unmaskCurrency(data.cmv);

      data.address.zipCode = this.unmaskInput(data.address.zipCode);

      data.responsible.dateOfBirth = this.dateMask.transform(JSON.parse(JSON.stringify(data.responsible.dateOfBirth)), 'AMERICAN');
      data.responsible.cpf = this.unmaskInput(data.responsible.cpf);
      data.responsible.phone = this.unmaskInput(data.responsible.phone);

      this.companyService.createCompany(data).subscribe((response) => {

        toastr.success('Dados enviados.');
        this.redirectTo('/admin/rounds/approval');

      }, (error) => {
        toastr.error('Ocorreu um erro, entre em contato com o administrador.', 'Erro');
        //  this.redirectTo('/admin/rounds/approval/' + this.id + '/details');
      }, () => {
        this.loading = false;
        this.loaderService.load(false);
      });
    } else {
      this.loading = false;
      this.loaderService.load(false);
      this.validateAllFields(this.form);
      toastr.error('Formulário preenchido incorretamente. Por favor revise seus dados.');
    }
  }

  public redirectTo(uri: string): void {
    this.router.navigateByUrl('/', {
      skipLocationChange: true
    }).then(() =>
      this.router.navigate([uri]));
  }

  public initForm(): void {
    this.form = this.formBuilder.group({
      address: this.formBuilder.group({
        city: [null, [Validators.required]],
        complement: [''],
        neighborhood: [null, [Validators.required]],
        number: [null, [Validators.required]],
        street: [null, [Validators.required]],
        uf: [null, [Validators.required]],
        zipCode: [null, [Validators.required, Validators.minLength(8)]]
      }),
      responsible: this.formBuilder.group({
        cpf: [null, [Validators.required, Validators.minLength(11)]],
        dateOfBirth: [null, [Validators.required]],
        email: [null, [Validators.required, Validators.pattern(this.emailPattern)]],
        name: [null, [Validators.required]],
        phone: [null, [Validators.required]],
        profession: [null, [Validators.required]],
        rg: [null, [Validators.required]],
      }),
      category: ['TRACTION'],
      type: ['SIMPLE'],
      cnpj: [null, [Validators.required, Validators.minLength(14)]],
      yearOfIncorporation: ['2000'],
      generalInfo: [' '],
      revenueModel: [' '],
      customersDescription: [' '],
      competitors: [' '],
      benchmarks: [' '],
      numberOfCustomers: ['0'],
      payingCustomers: ['0'],
      grossRevenue: [' '],
      operations: [' '],
      totalExpenditure: ['0'],
      investments: [' '],
      investmentsDeposited: [' '],
      incubation: [' '],
      valuation: [' '],
      roundValue: [' '],
      providers: [' '],
      description: [' '],
      contractModel: ['INVESTMENT'],
      hasDividends: [false],
      model: [null, [Validators.required]],
      video: [' '],
      pitch: [' '],
      businessName: [null, [Validators.required]],
      name: [null, [Validators.required, Validators.minLength(2)]],
      website: [null, [Validators.minLength(4)]],
      upgestao: [' '],
      bank: [' '],
      payment: [' '],
      managementIndicator: ['1'],
      technologyIndicator: ['1'],
      strategicIndicator: ['1'],
      intellectualIndicator: ['1'],
      societyIndicator: ['1'],
      peopleIndicator: ['1'],
      processIndicator: ['1'],
      resourceIndicator: ['1'],
      cac: ['0,00', [Validators.required]],
      averageTicket: ['0,00', [Validators.required]],
      ltv: ['0,00', [Validators.required]],
      activeCustomers: ['0', [Validators.required]],
      cmv: ['0,00', [Validators.required]],
      score: ['5']
    });
  }

  public initMask(): void {
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
    $('.dateOfBirth').mask('00/00/0000');
    $('.money').mask('#.##0,00', {
      reverse: true
    });
    $('.yearOfIncorporation').mask('0000', {
      reverse: true
    });
    $('.cnpj').mask('00.000.000/0000-00', {
      reverse: true
    });
    $('.cpf').mask('000.000.000-00', {
      reverse: true
    });
    $('.number').keyup(function () {
      $(this).val(this.value.replace(/\D/g, ''));
    });
  }

  public maxLengthValidator(text): void {
    if (text.length > 500) {
      this.textValidator = ' só permite 500 caracteres.';
    } else {
      this.textValidator = ' é obrigatório.';
    }
  }

  public validateAllFields(formGroup: FormGroup): void {
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

  public unmaskCnpj(cnpj: any): string {
    return cnpj.replace(/[^\d]+/g, '');
  }

  public unmaskCurrency(number: any): any {
    return (Number(number.replace(/[^\d]+/g, '')) / 100).toFixed(2);
  }

  public unmaskInput(input): any {
    return input.replace(/[^\d]+/g, '');
  }

  public unmaskMoney(input): any {
    return (Number(input.replace(/[^\d]+/g, '')) / 100).toFixed(2);
  }

  public yearsValidator(year: any): void {
    if (year !== null) {
      this.yearValidator = 'Ano de constituição inválido.';
    }
  }

  public clearAddress(): void {
    this.form.controls['street']?.setValue('');
    this.form.controls['city']?.setValue('');
    this.form.controls['uf']?.setValue('');
    this.form.controls['neighborhood']?.setValue('');
  }

  public getCep(): void {
    const data = this.form.value;
    let cep = data.address.zipCode;
    cep = cep.replace('-', '');
    if (cep !== '') {
      const validacep = /^[0-9]{8}$/;
      if (validacep.test(cep)) {

        this.form.controls['address'].setValue({
          city: '',
          complement: this.form.value.address.complement,
          neighborhood: '',
          number: this.form.value.address.number,
          street: '',
          uf: '',
          zipCode: this.form.value.address.zipCode
        });

        this.loading = true;
        this.loaderService.load(true);
        this.userService.getAddressByZipCode(cep).subscribe((dados) => {

          if (!('erro' in dados)) {

            this.form.controls['address'].setValue({
              city: dados.localidade,
              complement: this.form.value.address.complement,
              neighborhood: dados.bairro,
              number: this.form.value.address.number,
              street: dados.logradouro,
              uf: dados.uf,
              zipCode: this.form.value.address.zipCode
            });
          } else {
            this.clearAddress();
            bootbox.dialog({
              title: 'Campo incorreto',
              message: 'CEP não encontrado.',
              buttons: {
                ok: {
                  label: 'Fechar',
                  className: 'bg-upangel',
                  callback: function () { }
                }
              }
            });
          }
        }, () => null, () => {
          this.loading = false;
          this.loaderService.load(false);
        });
      } else {
        this.clearAddress();
        bootbox.dialog({
          title: 'Campo incorreto',
          message: 'Formato de CEP inválido',
          buttons: {
            ok: {
              label: 'Fechar',
              className: 'bg-upangel',
              callback: function () { }
            }
          }
        });
      }
    } else {
      this.clearAddress();
    }
  }

}
