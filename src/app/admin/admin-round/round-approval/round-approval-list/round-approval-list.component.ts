import { TiposModalidades } from './../../../../core/enums/modalidades.enum';
import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../../../core/service/company.service';
import { TitleService } from '../../../../core/service/title.service';
import { TitleHeader } from '../../../../core/interface/title-header';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from './../../../../core/service/loader.service';
import { DateMaskPipe } from './../../../../core/pipes/date-mask.pipe';

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
  isDropdownVisible: number | null = null;
  isSingUpCompanyModalOpen = false;

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

  loading: boolean = false;
  id: number;

  constructor(
    private companyService: CompanyService,
    private data: TitleService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private dateMask: DateMaskPipe,
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
    this.initForm();
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



  private getAllByStatus(status: any): void {
    this.loader = true;
    this.companyService.getAllByStatus(status).subscribe(
      (response) => {
        for (const company of response) {
          this.companies.push(company);
          this.filteredCompanies.push(company);
        }
        this.calculateTotalPages();
        this.loader = false;
      });
  }

  changeModalStatus() {
    this.isSingUpCompanyModalOpen = !this.isSingUpCompanyModalOpen;
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

}
