import { TiposModalidades } from './../../../../core/enums/modalidades.enum';
import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../../../core/service/company.service';
import { TitleService } from '../../../../core/service/title.service';
import { TitleHeader } from '../../../../core/interface/title-header';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from './../../../../core/service/loader.service';
import { DateMaskPipe } from './../../../../core/pipes/date-mask.pipe';
import { CepMaskPipe } from './../../../../core/pipes/cep-mask.pipe';
import { CpfMaskPipe } from './../../../../core/pipes/cpf-mask.pipe';
import { PhoneMaskPipe } from './../../../../core/pipes/phone-mask.pipe';
import { CnpjMaskPipe } from './../../../../core/pipes/cnpj-mask.pipe';
import { MoneyMaskPipe } from './../../../../core/pipes/money-mask.pipe';

declare var toastr: any;
@Component({
  selector: 'app-round-approval-list',
  templateUrl: './round-approval-list.component.html',
  styleUrls: ['./round-approval-list.component.css']
})
export class RoundApprovalListComponent implements OnInit {
  titleHeader: TitleHeader;
  form: FormGroup;
  emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  companies = [];
  total = [];
  filteredCompanies = [];
  status = true;
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
  isDropdownVisible: number | null = null;
  isSingUpCompanyModalOpen = false;
  isEditCompanyModalOpen = false;

  singUpCompanySessions = [
    {
      name: "Geral"
    },
    {
      name: "Responsável"
    },
    {
      name: "Endereço"
    },
    {
      name: "Indicadores"
    },
  ]
  active: boolean = false;

  loading: boolean = false;
  id: number;

  constructor(
    private companyService: CompanyService,
    private data: TitleService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private dateMask: DateMaskPipe,
    private cepMask: CepMaskPipe,
    private cpfMask: CpfMaskPipe,
    private phoneMask: PhoneMaskPipe,
    private cnpjMask: CnpjMaskPipe,
    private moneyMask: MoneyMaskPipe,
  ) { }

  selectedSession = "Geral";

  selectSession(sessionName: string) {
    this.selectedSession = sessionName;
  }

  ngOnInit() {
    this.data.currentMessage.subscribe(titles => this.titleHeader = titles);
    this.titleHeader.title = 'Administração / Atualizar Dados';
    this.data.changeTitle(this.titleHeader);
    this.loadCompanies();

    const $this = this;
    setTimeout(function () {
      $this.initMask();
    }, 1000);
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
      cac: [null],
      averageTicket: [null, [Validators.required]],
      ltv: [null],
      activeCustomers: [null, [Validators.required]],
      cmv: [null],
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

  public onSubmit(): void {
    this.loading = true;
    this.loaderService.load(this.loading);

    console.log(this.form.value)
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
      }, (error) => {
        toastr.error('Ocorreu um erro, entre em contato com o administrador.', 'Erro');
      }, () => {
        this.loading = false;
        this.isSingUpCompanyModalOpen = false;
        this.loaderService.load(this.loading);
      });
    } else {
      this.loading = false;
      this.loaderService.load(this.loading);
      this.validateAllFields(this.form);
      toastr.error('Formulário preenchido incorretamente. Por favor revise seus dados.');
    }
  }

  loadCompanies() {
    this.companies = [];
    this.filteredCompanies = [];
    this.getAllByStatus(this.status);
  }

  setStatus() {
    this.status = !this.status;
    this.loadCompanies();
    this.loader = false;
  }

  toggleCompanyStatus(id: number) {
    this.loader = true;
    this.companyService.changeCompanyActiveStatus(id).subscribe(
      (response) => {
        toastr.success('Status atualizados.');
        this.loader = false;
        this.isDropdownVisible = null;
        this.loadCompanies();
      },
    );
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

  private getAllByStatus(status: any): void {
    this.loader = true;
    this.companyService.getAllByActiveStatus(status).subscribe(
      (response) => {
        for (const company of response) {
          this.companies.push(company);
          this.filteredCompanies.push(company);
        }
        this.calculateTotalPages();
        this.loader = false;
      },
    );
  }

  changeModalStatus() {
    this.initForm();
    this.isSingUpCompanyModalOpen = !this.isSingUpCompanyModalOpen;
  }

  changeEditModalStatus(id: any) {
    this.getCompany(id);
    this.isEditCompanyModalOpen = !this.isEditCompanyModalOpen;
  }

  calculateTotalPages() {
    const totalCompanies = this.companies.length;
    this.totalPages = Math.ceil(totalCompanies / this.itemsPerPage);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  filterCompanies(searchTerm: string) {
    if (searchTerm) {
      this.filteredCompanies = this.companies.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      this.filteredCompanies = this.companies;
    }
    this.calculateTotalPages();
  }

  toggleDropdown(index: number) {
    this.isDropdownVisible = this.isDropdownVisible === index ? null : index;
  }

  public maskModel(model: string): string {
    const aux = TiposModalidades[model];
    if (!aux) {
      return "";
    }
    return aux;
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
  }

}
