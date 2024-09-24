import { LoaderService } from './../../../../core/service/loader.service';
import { MoneyMaskPipe } from './../../../../core/pipes/money-mask.pipe';
import { DateMaskPipe } from './../../../../core/pipes/date-mask.pipe';
import { CepMaskPipe } from './../../../../core/pipes/cep-mask.pipe';
import { PhoneMaskPipe } from './../../../../core/pipes/phone-mask.pipe';
import { CpfMaskPipe } from './../../../../core/pipes/cpf-mask.pipe';
import { CnpjMaskPipe } from './../../../../core/pipes/cnpj-mask.pipe';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { RadioOption } from '../../../../share/radio/radio-option.model';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '../../../../core/service/company.service';
import { Router } from '@angular/router';
import { Address } from '../../../../core/interface/address';
import { Responsible } from '../../../../core/interface/responsible';
import { UserService } from '../../../../core/service/user.service';
import { TitleService } from '../../../../core/service/title.service';
import { TitleHeader } from '../../../../core/interface/title-header';
import { Bank } from '../../../../core/interface/bank';
import { Subscription } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { BankService } from '../../../../core/service/bank.service';

declare var $: any;
declare var toastr: any;
declare var bootbox: any;

@Component({
  selector: 'app-round-approval-details',
  templateUrl: './round-approval-details.component.html',
  styleUrls: ['./round-approval-details.component.css']
})
export class RoundApprovalDetailsComponent implements OnInit {

  titleHeader: TitleHeader;
  form: FormGroup;
  emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  yearValidator = 'Ano de constituição é um campo obrigatório';
  textValidator = ' é obrigatório.';
  address: Address;
  responsible: Responsible;
  statusPendingDocs = {
    status: 'PENDING_DOCS'
  };
  statusApproved = {
    status: 'APPROVED'
  };
  statusDisapproved = {
    status: 'REPROVED'
  };
  id: number;

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

  model: RadioOption[] = [
    {
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

  legalType: RadioOption[] = [
    {
      label: 'MEI',
      value: 'MEI',
      span: ''
    },
    {
      label: 'EI',
      value: 'EI',
      span: ''
    },
    {
      label: 'EIRELI',
      value: 'EIRELI',
      span: ''
    },
    {
      label: 'LTDA',
      value: 'LTDA',
      span: ''
    },
    {
      label: 'SLU',
      value: 'SLU',
      span: ''
    },
    {
      label: 'SA',
      value: 'SA',
      span: ''
    }
  ]

  loading: boolean = false;

  banks: Bank[] = []
  $banks!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private activedRouter: ActivatedRoute,
    private companyService: CompanyService,
    private router: Router,
    private userService: UserService,
    private data: TitleService,
    private moneyMask: MoneyMaskPipe,
    private cpfMask: CpfMaskPipe,
    private cnpjMask: CnpjMaskPipe,
    private phoneMask: PhoneMaskPipe,
    private cepMask: CepMaskPipe,
    private dateMask: DateMaskPipe,
    private loaderService: LoaderService,
    private bankService: BankService
  ) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(titles => this.titleHeader = titles);
    this.titleHeader.title = 'Administração / Atualizar Dados';
    this.data.changeTitle(this.titleHeader);
    this.id = this.activedRouter.snapshot.params['id'];
    this.initForm();
    this.getCompany(this.id);

    const $this = this;
    setTimeout(function () {
      $this.initMask();
    }, 1000);

    this.getBanks();
  }

  public getCompany(id): void {
    this.companyService.getCompany(id).subscribe((response) => {
      this.form.get('address').setValue({
        city: response.address.city,
        complement: response.address.complement,
        neighborhood: response.address.neighborhood,
        number: response.address.number,
        street: response.address.street,
        uf: response.address.uf,
        zipCode: this.cepMask.transform(response.address.zipCode)
      });
      this.form.get('responsible').setValue({
        name: response.responsible.name,
        profession: response.responsible.profession,
        dateOfBirth: this.dateMask.transform(response.responsible.dateOfBirth),
        rg: response.responsible.rg,
        cpf: this.cpfMask.transform(response.responsible.cpf),
        email: response.responsible.email,
        phone: this.phoneMask.transform(response.responsible.phone)
      });
      this.form.get('businessName').setValue(response.businessName);
      this.form.get('cnpj').setValue(this.cnpjMask.transform(response.cnpj));
      this.form.get('website').setValue(response.website);
      this.form.get('facebook').setValue(response.facebook);
      this.form.get('linkedin').setValue(response.linkedin);
      this.form.get('twitter').setValue(response.twitter);
      this.form.get('category').setValue(response.category);
      this.form.get('type').setValue(response.type);
      this.form.get('yearOfIncorporation').setValue(response.yearOfIncorporation);
      this.form.get('generalInfo').setValue(response.generalInfo);
      this.form.get('revenueModel').setValue(response.revenueModel);
      this.form.get('customersDescription').setValue(response.customersDescription);
      this.form.get('competitors').setValue(response.competitors);
      this.form.get('benchmarks').setValue(response.benchmarks);
      this.form.get('numberOfCustomers').setValue(response.numberOfCustomers);
      this.form.get('payingCustomers').setValue(response.payingCustomers);
      this.form.get('grossRevenue').setValue(response.grossRevenue);
      this.form.get('operations').setValue(response.operations);
      this.form.get('totalExpenditure').setValue(this.moneyMask.transform(response.totalExpenditure));
      this.form.get('investments').setValue(response.investments);
      this.form.get('investmentsDeposited').setValue(response.investmentsDeposited);
      this.form.get('incubation').setValue(response.incubation);
      this.form.get('valuation').setValue(response.valuation);
      this.form.get('roundValue').setValue(response.roundValue);
      this.form.get('providers').setValue(response.providers);
      this.form.get('description').setValue(response.description);
      this.form.get('contractModel').setValue(response.contractModel);
      this.form.get('hasDividends').setValue(response.hasDividends);
      this.form.get('model').setValue(response.model);
      this.form.get('video').setValue(response.video);
      this.form.get('pitch').setValue(response.pitch);
      this.form.get('name').setValue(response.name);
      this.form.get('upgestao').setValue(response.upgestao);
      this.form.get('bank').setValue(response.bank);
      this.form.get('payment').setValue(response.payment);
      this.form.get('managementIndicator').setValue(response.managementIndicator);
      this.form.get('technologyIndicator').setValue(response.technologyIndicator);
      this.form.get('strategicIndicator').setValue(response.strategicIndicator);
      this.form.get('intellectualIndicator').setValue(response.intellectualIndicator);
      this.form.get('societyIndicator').setValue(response.societyIndicator);
      this.form.get('peopleIndicator').setValue(response.peopleIndicator);
      this.form.get('processIndicator').setValue(response.processIndicator);
      this.form.get('resourceIndicator').setValue(response.resourceIndicator);
      this.form.get('cac').setValue(this.moneyMask.transform(response.cac));
      this.form.get('averageTicket').setValue(this.moneyMask.transform(response.averageTicket));
      this.form.get('ltv').setValue(this.moneyMask.transform(response.ltv));
      this.form.get('activeCustomers').setValue(response.activeCustomers);
      this.form.get('cmv').setValue(this.moneyMask.transform(response.cmv));
      this.form.get('score').setValue(response.score);
      this.form.get('cnae').setValue(response.cnae);
      this.form.get('nire').setValue(response.nire);
      this.form.get('legalType').setValue(response.legalType);
      this.form.get('accountAgency').setValue(response.accountAgency);
      this.form.get('accountBank').setValue(response.accountBank);
      this.form.get('accountNumber').setValue(response.accountNumber);
      this.form.get('volutiId').setValue(response.volutiId);
      this.form.get('ltvCac').setValue(this.moneyMask.transform(response.ltvCac));
      this.form.get('cashburnIndicator').setValue(this.moneyMask.transform(response.cashburnIndicator));
      this.form.get('sharePriceIndicator').setValue(this.moneyMask.transform(response.sharePriceIndicator));
      this.initMask();
    });
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
      category: [null, [Validators.required]],
      type: [null, [Validators.required]],
      cnpj: [null, [Validators.required, Validators.minLength(14)]],
      nire: [null, [Validators.required]],
      cnae: [null, [Validators.required]],
      legalType: [null, [Validators.required]],
      yearOfIncorporation: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      generalInfo: [null, [Validators.required, Validators.maxLength(500)]],
      revenueModel: [null, [Validators.required, Validators.maxLength(500)]],
      customersDescription: [null, [Validators.required, Validators.maxLength(500)]],
      competitors: [null, [Validators.required, Validators.maxLength(500)]],
      benchmarks: [null, [Validators.required, Validators.maxLength(500)]],
      numberOfCustomers: [null, [Validators.required]],
      payingCustomers: [null, [Validators.required]],
      grossRevenue: [null, [Validators.required, Validators.maxLength(500)]],
      operations: [null, [Validators.required, Validators.maxLength(500)]],
      //partners: this.formBuilder.array([]),
      totalExpenditure: [null, [Validators.required]],
      investments: [null, [Validators.required, Validators.maxLength(500)]],
      investmentsDeposited: [null, [Validators.required, Validators.maxLength(500)]],
      incubation: [null, [Validators.required, Validators.maxLength(500)]],
      valuation: [null, [Validators.required, Validators.maxLength(500)]],
      roundValue: [null, [Validators.required, Validators.maxLength(500)]],
      providers: [null, [Validators.required, Validators.maxLength(500)]],
      description: [null, [Validators.maxLength(500)]],
      contractModel: [null, [Validators.required]],
      hasDividends: [null, [Validators.required]],
      model: [null, [Validators.required]],
      video: [null, [Validators.required]],
      pitch: [null, [Validators.required]],
      businessName: [null, [Validators.required]],
      name: [null, [Validators.required, Validators.minLength(2)]],
      website: [null, [Validators.minLength(4)]],
      facebook: [null],
      linkedin: [null],
      twitter: [null],
      upgestao: [null],
      bank: [null],
      payment: [null],
      managementIndicator: [null],
      technologyIndicator: [null],
      strategicIndicator: [null],
      intellectualIndicator: [null],
      societyIndicator: [null],
      peopleIndicator: [null],
      processIndicator: [null],
      resourceIndicator: [null],
      cac: [null, [Validators.required]],
      averageTicket: [null, [Validators.required]],
      ltv: [null, [Validators.required]],
      activeCustomers: [null, [Validators.required]],
      cmv: [null, [Validators.required]],
      score: [null],
      ltvCac: [null],
      cashburnIndicator: [null],
      sharePriceIndicator: [null],
      accountAgency: [null],
      accountBank: [null],
      accountNumber: [null],
      volutiId: [null],
    });
  }

  get partners(){
    return this.form.get("partners") as FormArray;
  }

  addPartner(){
    this.partners.push(this.formBuilder.group({
      email: [null, [Validators.required]],
      name: [null, [Validators.required]],
      cellphone: [null, [Validators.required]],
      cpf: [null, [Validators.required]],
      rg: [null, [Validators.required]],
      dateOfBirth: [null, [Validators.required]],
    }));
  }

  removePartner(index: number){
    this.partners.removeAt(index);
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

  public maskValuation(number: any): any {

  let numeric = number.replace(/[^\d]+/g, '');

  numeric = (Number(numeric) / 100).toFixed(2); 

  let parts = numeric.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return parts.join(',');  

  }

  public unmaskInput(input): any {
    return input.replace(/[^\d]+/g, '');
  }

  public unmaskMoney(input): any {
    return (Number(input.replace(/[^\d]+/g, '')) / 100).toFixed(2);
  }

  public onSubmit(): void {
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
      data.ltvCac = this.unmaskCurrency(data.ltvCac);
      data.cashburnIndicator = this.unmaskCurrency(data.cashburnIndicator);
      data.valuation = this.maskValuation(data.valuation);
      data.sharePriceIndicator = this.unmaskCurrency(data.sharePriceIndicator);

      data.address.zipCode = this.unmaskInput(data.address.zipCode);

      data.responsible.dateOfBirth = this.dateMask.transform(data.responsible.dateOfBirth, 'AMERICAN');
      data.responsible.cpf = this.unmaskInput(data.responsible.cpf);
      data.responsible.phone = this.unmaskInput(data.responsible.phone);

      this.companyService.updateCompany(this.id, data).subscribe((response) => {

        toastr.success('Dados atualizados.');
        this.redirectTo('/admin/rounds/approval/' + this.id + '/details');

      }, (error) => {
        toastr.error('Ocorreu um erro, entre em contato com o administrador.', 'Erro');
        //  this.redirectTo('/admin/rounds/approval/' + this.id + '/details');
      }, () => {
        this.loading = false;
        this.loaderService.load(this.loading);
      });
    } else {
      this.loading = false;
      this.loaderService.load(this.loading);
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

  public approveDocuments(): void {
    if (this.form.valid) {
      const $this = this;

      this.companyService.updateStatus(this.id, this.statusPendingDocs).subscribe((response) => {
        this.approveCompany();
      }, (error) => {
        toastr.error('Ocorreu um erro, contate o administrador.');
      });

    } else {
      this.validateAllFields(this.form);
      toastr.error('Formulário preenchido incorretamente. Por favor revise seus dados.');
    }
  }

  public approveCompany(): void {
    if (this.form.valid) {
      const $this = this;

      this.companyService.updateStatus(this.id, this.statusApproved).subscribe((response) => {
        bootbox.dialog({
          title: '',
          message: 'A empresa foi aprovada.',
          buttons: {
            'success': {
              label: 'Entendi',
              className: 'bg-upangel',
              callback: function () {
                $this.router.navigate(['/admin/rounds/approval/company/final']);
              }
            }
          }
        });
      }, (error) => {
        toastr.error('Ocorreu um erro, contate o administrador.');
      });

    } else {
      this.validateAllFields(this.form);
      toastr.error('Formulário preenchido incorretamente. Por favor revise seus dados.');
    }
  }

  public yearsValidator(year: any): void {
    if (year !== null) {
      this.yearValidator = 'Ano de constituição inválido.';
    }
  }

  public clearAddress(): void {
    this.form.get('street').setValue('');
    this.form.get('city').setValue('');
    this.form.get('uf').setValue('');
    this.form.get('neighborhood').setValue('');
  }

  public getCep(): void {
    const data = this.form.value;
    let cep = data.address.zipCode;
    cep = cep.replace('-', '');
    if (cep !== '') {
      const validacep = /^[0-9]{8}$/;
      if (validacep.test(cep)) {

        this.form.get('address').setValue({
          city: '',
          complement: this.form.value.address.complement,
          neighborhood: '',
          number: this.form.value.address.number,
          street: '',
          uf: '',
          zipCode: this.form.value.address.zipCode
        });

        this.userService.getAddressByZipCode(cep).subscribe((dados) => {

          if (!('erro' in dados)) {

            this.form.get('address').setValue({
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

  getBanks(){
    this.$banks?.unsubscribe();

    this.$banks = this.bankService
      .getAll()
      .subscribe({
        next: (response: HttpResponse<Bank[]>) => {

          if(response.status != 200){
            return;
          }

          this.banks = response?.body
            .map(bank => {
              if(bank.code){
                bank.name = `${String(bank.code).padStart(3, "0")} - ${bank.name}`;
              }
              return bank;
            })
            .sort((a: Bank, b: Bank) => a.name > b.name ? 1 : -1);
        }
      })
  }

}
