import { TiposModalidades } from './../../../../core/enums/modalidades.enum';
import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../../../core/service/company.service';
import { TitleService } from '../../../../core/service/title.service';
import { TitleHeader } from '../../../../core/interface/title-header';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoaderService } from './../../../../core/service/loader.service';
import { saveAs } from 'file-saver';
import { DateMaskPipe } from './../../../../core/pipes/date-mask.pipe';
import { CepMaskPipe } from './../../../../core/pipes/cep-mask.pipe';
import { CpfMaskPipe } from './../../../../core/pipes/cpf-mask.pipe';
import { PhoneMaskPipe } from './../../../../core/pipes/phone-mask.pipe';
import { CnpjMaskPipe } from './../../../../core/pipes/cnpj-mask.pipe';
import { MoneyMaskPipe } from './../../../../core/pipes/money-mask.pipe';
import { CompanyFinancialService } from '../../../../core/service/company-financial.service';
import { Valuation } from '../../../../core/interface/valuation';
import { CompanyCaptableService } from '../../../../core/service/company-captable.service';
import { Team } from '../../../../core/interface/team';
import { CompanyPartner } from '../../../../core/interface/company-partners';
import { finalize } from 'rxjs/operators';
import { CompanyPartnersService } from '../../../../core/service/company-partners.service';



declare var bootbox: any;
declare var toastr: any;
declare var moment: any;
@Component({
  selector: 'app-round-approval-list',
  templateUrl: './round-approval-list.component.html',
  styleUrls: ['./round-approval-list.component.css']
})
export class RoundApprovalListComponent implements OnInit {
  titleHeader: TitleHeader;
  form: FormGroup;
  selectedMember: Team | null = null;
  adminForm: FormGroup;
  expenseForm: FormGroup;
  valuationForm: FormGroup;
  captableForm: FormGroup;
  totalCompanies: number = 0; 
  partnerForm: FormGroup;
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
  isUpdateCompanyModalOpen = false;
  companyId = 0;
  valuation: Valuation;
  members: Team[] = [];
  partners: CompanyPartner[];

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
  updateCompanySessions = [
    {
      name: "Valuation"
    },
    {
      name: "Captable"
    },
    {
      name: "Receita e despesa"
    },
    // {
    //   name: "Administradores"
    // },
    {
      name: "Equipe Executiva"
    },
    {
      name: "Quadro societário"
    },
  ]

  active: boolean = false;

  loading: boolean = false;
  id: number;
  loadingMembers: boolean;

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
    private financialService: CompanyFinancialService,
    private captableService: CompanyCaptableService,
    private router: Router,
    private partnersService: CompanyPartnersService,
  ) { }

  selectedSession = "Geral";
  selectedUpdateSession = "Valuation";

  openUpdateCompanyModal(id: number) {
    this.id = id;
    this.isUpdateCompanyModalOpen = true;
    this.getValuation(id);
    this.getFinancial(id);
    this.getCaptable(id);
    this.getTeam();
    this.getPartners();
  }

  sendMemberSession() {
    this.redirectTo('admin/rounds/company/team/' + this.id);
  }

  sendPartnerSession() {
    this.redirectTo('admin/rounds/company/partners/' + this.id);
  }

  toggleMemberDetails(member: Team): void {
    member.showDetails = !member.showDetails;
  }

  editMember(member: Team): void {
    this.router.navigate(['admin/rounds/company/team/edit', this.id, member.id]);
  }

  addNewMember() {
    const newMemberIndex = this.members.length > 0 ? Math.max(...this.members.map(m => m.id)) + 1 : 1;

    const newMember: Team = {
      id: newMemberIndex, 
      fullName: '',
      email: '',
      department: '',
      linkedin: '',
      activities: '',
      role: '',
      photo: '', 
      showDetails: true 
    };

    this.members.push(newMember);
  }

  onRemove(id: number): void {
    bootbox.confirm({
      title: "Confirmação",
      message: "Deseja realmente excluir o registro?",
      buttons: {
        confirm: {
          label: "Confirmar",
          className: "bg-upangel",
        },
        cancel: {
          label: "Cancelar",
          className: "bg-upangel",
        },
      },
      callback: (result) => {
        if (result) {
          this.deleteTeamMember(id);
        }
      },
    });
  }
  
  deleteTeamMember(id: number): void {
    this.loading = true;
    this.loaderService.load(this.loading);
  
    this.companyService.deleteTeamMember(this.id, id).subscribe(
      () => {
        toastr.success('Registro excluído com sucesso.');
        this.getTeam();
      },
      () => {
        toastr.error('Falha ao excluir registro.');
      },
      () => {
        this.loading = false;
        this.loaderService.load(this.loading);
      }
    );
  }

  public redirectTo(uri: string): void {
    this.router.navigateByUrl('/', {
      skipLocationChange: true
    }).then(() =>
      this.router.navigate([uri]));
  }

  selectSession(sessionName: string) {
    this.selectedSession = sessionName;
  }

  selectUpdateSession(sessionName: string) {
    this.selectedUpdateSession = sessionName;
  }

  get partnersForm() {
    return this.form.get("partners") as FormArray;
  }

  addPartner() {
    this.partnersForm.push(this.formBuilder.group({
      id: [null],
      email: [null, [Validators.required]],
      fullName: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      cpf: [null, [Validators.required]],
      rg: [null, [Validators.required]],
      rgDate: [null, [Validators.required]],
      maritalStatus: [null, [Validators.required]],
      profession: [null, [Validators.required]],
      dateOfBirth: [null, [Validators.required]],
      address: this.formBuilder.group({
        city: [null, [Validators.required]],
        complement: [''],
        neighborhood: [null, [Validators.required]],
        number: [null, [Validators.required]],
        street: [null, [Validators.required]],
        uf: [null, [Validators.required]],
        zipCode: [null, [Validators.required, Validators.minLength(8)]]
      })
    }));
  }

  getPartners() {
    this.partnersService.getPartner(this.id).subscribe((response) => {
      this.partners = response;
      this.loader = false;
    }, (error) => {
      const $this = this;
      setTimeout(function () {
        $this.initMask();
      }, 1000);

      this.loader = false;
    });
  }

  ngOnInit() {
    this.data.currentMessage.subscribe(titles => this.titleHeader = titles);
    this.titleHeader.title = 'Administração / Atualizar Dados';
    this.data.changeTitle(this.titleHeader);
    this.loadCompanies();
    this.initAdminForm();
    this.initExpenseForm();
    this.initValuationForm();
    this.initCaptableForm();
    this.initForm();

    const $this = this;
    setTimeout(function () {
      $this.initMask();
    }, 1000);
  }

  ngAfterViewInit() {
    this.initMask();
  }

  public initAdminForm(): void {
    this.adminForm = this.formBuilder.group({
      userName: [null, [Validators.required]]
    });
  }

  initCaptableForm() {
    this.captableForm = this.formBuilder.group({
      id: [null],
      founders: ['0,00', [Validators.required, Validators.minLength(3)]],
      coFounders: ['0,00', [Validators.required, Validators.minLength(3)]],
      vesting: ['0,00', [Validators.required, Validators.minLength(3)]],
      accelerator: ['0,00', [Validators.required, Validators.minLength(3)]],
      crowdfunding: ['0,00', [Validators.required, Validators.minLength(3)]],
      angel: ['0,00', [Validators.required, Validators.minLength(3)]],
      venture1: ['0,00', [Validators.required, Validators.minLength(3)]],
      venture2: ['0,00', [Validators.required, Validators.minLength(3)]],
      venture3: ['0,00', [Validators.required, Validators.minLength(3)]],
      ventureBuilder1: ['0,00', [Validators.required, Validators.minLength(3)]],
      ventureBuilder2: ['0,00', [Validators.required, Validators.minLength(3)]],
      ventureBuilder3: ['0,00', [Validators.required, Validators.minLength(3)]],
      investmentFund1: ['0,00', [Validators.required, Validators.minLength(3)]],
      investmentFund2: ['0,00', [Validators.required, Validators.minLength(3)]]
    });
  }

  onCaptableSubmit() {
    if (this.captableForm.valid) {
      const dataSend = this.captableForm.value;
      dataSend.founders = this.unmaskMoney(dataSend.founders);
      dataSend.coFounders = this.unmaskMoney(dataSend.coFounders);
      dataSend.vesting = this.unmaskMoney(dataSend.vesting);
      dataSend.accelerator = this.unmaskMoney(dataSend.accelerator);
      dataSend.crowdfunding = this.unmaskMoney(dataSend.crowdfunding);
      dataSend.angel = this.unmaskMoney(dataSend.angel);
      dataSend.venture1 = this.unmaskMoney(dataSend.venture1);
      dataSend.venture2 = this.unmaskMoney(dataSend.venture2);
      dataSend.venture3 = this.unmaskMoney(dataSend.venture3);
      dataSend.ventureBuilder1 = this.unmaskMoney(dataSend.ventureBuilder1);
      dataSend.ventureBuilder2 = this.unmaskMoney(dataSend.ventureBuilder2);
      dataSend.ventureBuilder3 = this.unmaskMoney(dataSend.ventureBuilder3);
      dataSend.investmentFund1 = this.unmaskMoney(dataSend.investmentFund1);
      dataSend.investmentFund2 = this.unmaskMoney(dataSend.investmentFund2);
  
      this.loading = true;
      this.loaderService.load(this.loading);
  
      this.captableService.createCaptable(this.id, dataSend).subscribe({
        next: (response) => {
          toastr.success('Dados enviados.');
        },
        error: (error) => {
          const errorMessage = this.getDetailedErrorMessage(error);
          toastr.error(errorMessage, 'Erro');
        },
        complete: () => {
          this.loading = false;
          this.loaderService.load(this.loading);
        }
      });
    } else {
      this.validateAllFields(this.captableForm);
      toastr.error('Formulário preenchido incorretamente. Por favor revise seus dados.');
    }
  }
  
  private getDetailedErrorMessage(error: any): string {
    let message = 'Ocorreu um erro inesperado.';
  
    if (error?.error) {
      if (typeof error.error === 'string') {
        message = error.error; 
      } else if (typeof error.error === 'object') {
        const errorDetails = error.error.errors || error.error;
        const errorFields = Object.keys(errorDetails).map(
          (field) => `${field}: ${errorDetails[field]}`
        );
        message = `Erro nos campos: ${errorFields.join(', ')}`;
      }
    } else if (error?.message) {
      message = error.message;
    }
  
    return message;
  }
  

  public initValuationForm(): void {
    this.valuationForm = this.formBuilder.group({
      current: ['0,00', [Validators.required, Validators.minLength(3)]],
      shortTerm: ['0,00', [Validators.required, Validators.minLength(3)]],
      longTerm: ['0,00', [Validators.required, Validators.minLength(3)]]
    });
  }

  private validateSpecificFields(fields: string[]): void {
    const invalidFields: string[] = [];
  
    fields.forEach((field) => {
      const control = this.form.get(field);
      if (control instanceof FormControl) {
        if (control.invalid) {
          invalidFields.push(this.getFieldLabel(field));
        }
        control.markAsTouched({ onlySelf: true });
      }
    });
  
    if (invalidFields.length > 0) {
      toastr.error(`Os seguintes campos estão inválidos: ${invalidFields.join(', ')}`);
    }
  }
  

  onValuationSubmit() {
    this.validateSpecificFields(['current', 'shortTerm', 'longTerm']);
  
    const currentControl = this.valuationForm.get('current');
    const shortTermControl = this.valuationForm.get('shortTerm');
    const longTermControl = this.valuationForm.get('longTerm');
  
    if (currentControl.valid && shortTermControl.valid && longTermControl.valid) {
      const dataSend = this.valuationForm.value;
      dataSend.date = moment(new Date()).format('DD/MM/YYYY hh:mm:ss');
      dataSend.current = this.unmaskMoney(dataSend.current);
      dataSend.shortTerm = this.unmaskMoney(dataSend.shortTerm);
      dataSend.longTerm = this.unmaskMoney(dataSend.longTerm);
  
      this.loading = true;
      this.loaderService.load(this.loading);
      this.companyService.createValuation(this.id, dataSend).subscribe({
        next: (response) => {
          toastr.success('Dados atualizados.');
          this.getValuation(this.id);
        },
        error: (error) => {
          const errorMessage = this.getDetailedErrorMessage(error);
          toastr.error(errorMessage, 'Erro');
        },
        complete: () => {
          this.loading = false;
          this.loaderService.load(this.loading);
        }
      });
    } else {
      toastr.error('Os campos obrigatórios estão preenchidos incorretamente. Por favor revise seus dados.');
    }
  }

  getTeam() {
    this.loadingMembers = true;
  
    this.companyService.getTeam(this.id)
      .pipe(finalize(() => {
        this.loadingMembers = false;
        this.loaderService.load(this.loadingMembers);
      }))
      .subscribe({
        next: (response) => {
          this.members = response.map(member => ({ ...member, showDetails: false }));
        },
        error: () => {
          toastr.error('Erro ao carregar equipe executiva.');
        }
      });
  }
  

  getValuation(idCompany: number) {
    this.companyService.getValuation(idCompany).subscribe(
      (response) => {
        const currentValue = response?.current || 0;
        const shortTermValue = response?.shortTerm || 0;
        const longTermValue = response?.longTerm || 0;
  
        this.valuationForm.controls['current'].setValue(this.moneyMask.transform(currentValue));
        this.valuationForm.controls['shortTerm'].setValue(this.moneyMask.transform(shortTermValue));
        this.valuationForm.controls['longTerm'].setValue(this.moneyMask.transform(longTermValue));
  
        const $this = this;
        setTimeout(function () {
          $this.initMask();
        }, 1000);
  
        this.loader = false;
      },
      (error) => {
        this.valuationForm.controls['current'].setValue(this.moneyMask.transform(0));
        this.valuationForm.controls['shortTerm'].setValue(this.moneyMask.transform(0));
        this.valuationForm.controls['longTerm'].setValue(this.moneyMask.transform(0));
  
        const $this = this;
        setTimeout(function () {
          $this.initMask();
        }, 1000);
  
        this.loader = false;
      }
    );
  }

  getFinancial(idCompany: number) {
    this.financialService.getFinancial(idCompany).subscribe(
      (response) => {

        const financialResponse = response as unknown as any[];
  
        if (financialResponse && financialResponse.length > 0) {
          const financialData = financialResponse[0];
          
          this.expenseForm.patchValue({
            date: financialData.date || null,
            revenueAmount: this.formatToCurrency(financialData.revenueAmount),
            expenseAmount: this.formatToCurrency(financialData.expenseAmount)
          });
  
          setTimeout(() => {
            this.initMask();
          }, 1000);
        } else {
          console.warn('Nenhum dado financeiro encontrado.');
        }
  
        this.loader = false;
      },
      (error) => {
        console.error('Erro ao buscar dados de receita e despesa:', error);
  
        setTimeout(() => {
          this.initMask();
        }, 1000);
  
        this.loader = false;
      }
    );
  }

  getCaptable(idCompany: number) {
    this.captableService.getCaptable(idCompany).subscribe(
      (response) => {
        this.captableForm.patchValue({
          id: response.id || null,
          founders: this.formatToCurrency(response.founders),
          coFounders: this.formatToCurrency(response.coFounders),
          vesting: this.formatToCurrency(response.vesting),
          accelerator: this.formatToCurrency(response.accelerator),
          crowdfunding: this.formatToCurrency(response.crowdfunding),
          angel: this.formatToCurrency(response.angel),
          venture1: this.formatToCurrency(response.venture1),
          venture2: this.formatToCurrency(response.venture2),
          venture3: this.formatToCurrency(response.venture3),
          ventureBuilder1: this.formatToCurrency(response.ventureBuilder1),
          ventureBuilder2: this.formatToCurrency(response.ventureBuilder2),
          ventureBuilder3: this.formatToCurrency(response.ventureBuilder3),
          investmentFund1: this.formatToCurrency(response.investmentFund1),
          investmentFund2: this.formatToCurrency(response.investmentFund2),
        });
  
        const $this = this;
        setTimeout(function () {
          $this.initMask();
        }, 1000);
  
        this.loader = false;
      },
      (error) => {
        console.error('Erro ao buscar dados do captable:', error);
  
        const $this = this;
        setTimeout(function () {
          $this.initMask();
        }, 1000);
  
        this.loader = false;
      }
    );
  }
  
  private formatToCurrency(value: number | null): string {
    if (value === null || value === undefined) {
      return '0,00';
    }
    
    return value.toFixed(2).replace('.', ',');
  }
  
  
  public initExpenseForm(): void {
    this.expenseForm = this.formBuilder.group({
      date: [null, [Validators.required]],
      revenueAmount: ['0,00', [Validators.required, Validators.minLength(3)]],
      expenseAmount: ['0,00', [Validators.required, Validators.minLength(3)]]
    });
  }


  maskMoney(value: string): string {
    value = value.replace(/\D/g, ''); 
    value = (Number(value) / 100).toFixed(2) + ''; 
    value = value.replace('.', ',');
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return value;
  }

  onInputChange(event: any, controlName: string) {
    const value = event.target.value;
    this.expenseForm.get(controlName).setValue(this.maskMoney(value), { emitEvent: false });
  }


  unmaskMoney(input) {
    return (Number(input.replace(/[^\d]+/g, '')) / 100).toFixed(2);
  }

  onExpenseSubmit() {
    if (this.expenseForm.valid) {
      const dataSend = this.expenseForm.value;
  
      const inputDate = new Date(dataSend.date);
      const formattedDate = inputDate.toISOString().split('T')[0]; 
      dataSend.date = formattedDate;
  
      dataSend.revenueAmount = this.unmaskMoney(dataSend.revenueAmount);
      dataSend.expenseAmount = this.unmaskMoney(dataSend.expenseAmount);
  
      this.loading = true;
      this.loaderService.load(this.loading);
  
      this.financialService.createFinancial(this.id, dataSend).subscribe(
        (response) => {
          toastr.success('Dados enviados.');
          this.expenseForm.reset();
        },
        (error) => {
          toastr.error('Ocorreu um erro, contate o administrador.');
        },
        () => {
          this.loading = false;
          this.loaderService.load(this.loading);
        }
      );
    } else {
      this.validateAllFields(this.expenseForm);
      toastr.error('Formulário preenchido incorretamente. Por favor revise seus dados.');
    }
  }
  

  onSubmitAdmin() {
    if (this.adminForm.valid) {
      const dataSend = this.adminForm.value;
      this.loading = true;
      this.loaderService.load(this.loading);
      this.companyService.createAdmin(this.companyId, dataSend).subscribe((response) => {
        toastr.success('Administrador atualizado.');
        this.adminForm.reset();
      }, (error) => {
        toastr.error('Ocorreu um erro, contate o administrador.');
        const errorMessage = this.getDetailedErrorMessage(error);
        toastr.error(errorMessage, 'Erro');
      }, () => {
        this.loading = false;
        this.loaderService.load(this.loading);
      });
    } else {
      this.validateAllFields(this.adminForm);
      toastr.error('Formulário preenchido incorretamente. Por favor revise seus dados.');
    }
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
      partners: this.formBuilder.array([]),
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

  private getFieldLabel(field: string): string {
    const fieldLabels: { [key: string]: string } = {
      userName: 'Nome de Usuário',
      founders: 'Fundadores',
      coFounders: 'Cofundadores',
      vesting: 'Vesting',
      accelerator: 'Aceleradora',
      crowdfunding: 'Crowdfunding',
      angel: 'Anjo',
      venture1: 'Venture 1',
      venture2: 'Venture 2',
      venture3: 'Venture 3',
      ventureBuilder1: 'Venture Builder 1',
      ventureBuilder2: 'Venture Builder 2',
      ventureBuilder3: 'Venture Builder 3',
      investmentFund1: 'Fundo de Investimento 1',
      investmentFund2: 'Fundo de Investimento 2',
      email: 'E-mail',
      cpf: 'CPF',
      phone: 'Telefone',
      name: 'Nome',
      street: 'Rua',
      neighborhood: 'Bairro',
      city: 'Cidade',
      uf: 'Estado',
      zipCode: 'CEP',
    };
  
    return fieldLabels[field] || field;
  }

  public validateAllFields(formGroup: FormGroup): void {
    const invalidFields: string[] = [];
  
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        if (control.invalid) {
          invalidFields.push(this.getFieldLabel(field));
        }
        control.markAsTouched({
          onlySelf: true
        });
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control);
      } else if (control instanceof FormArray) {
        (control as FormArray).controls.forEach((group, index) => {
          if (group instanceof FormGroup) {
            Object.keys(group.controls).forEach(subField => {
              if (group.get(subField).invalid) {
                invalidFields.push(`${this.getFieldLabel(subField)} no item ${index + 1}`);
              }
            });
          }
        });
      }
    });
  
    if (invalidFields.length > 0) {
      toastr.error(`Os seguintes campos estão inválidos: ${invalidFields.join(', ')}`);
    }
  }

  public unmaskCnpj(cnpj: any): string {
    return cnpj.replace(/[^\d]+/g, '');
  }

  public unmaskCurrency(number: any): any {
    if (number === null || number === undefined) {
        return null;
    }
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
  
    this.validateRelevantFields(this.form);
  
    const data = this.form.value;
  
    data.cnpj = this.unmaskCnpj(data.cnpj);
    data.cac = this.unmaskCurrency(data.cac);
    data.ltv = this.unmaskCurrency(data.ltv);
    data.cmv = this.unmaskCurrency(data.cmv);
  
    data.address.zipCode = this.unmaskInput(data.address.zipCode);
  
    const rawDate = data.responsible.dateOfBirth;
  
    if (rawDate) {
      data.responsible.dateOfBirth = this.formatDateToISO(rawDate);
    } else {
      toastr.error("Data de nascimento não preenchida ou inválida.");
      this.loading = false;
      this.loaderService.load(this.loading);
      return;
    }
  
    data.responsible.cpf = this.unmaskInput(data.responsible.cpf);
    data.responsible.phone = this.unmaskInput(data.responsible.phone);
    data.responsible.rg = this.unmaskInput(data.responsible.rg);
  
    delete data.partners;
    delete data.totalExpenditure;
    delete data.averageTicket;
    delete data.ltvCac;
    delete data.cashburnIndicator;
    delete data.sharePriceIndicator;
    delete data.accountAgency;
    delete data.accountBank;
    delete data.accountNumber;
    delete data.cnae;
    delete data.benchmarks;
    delete data.competitors;
    delete data.facebook;
    delete data.generalInfo;
    delete data.grossRevenue;
    delete data.incubation;
    delete data.legalType;
    delete data.volutiId;
    delete data.video;
    delete data.twitter;
    delete data.providers;
    delete data.nire;

    this.companyService.updateCompany(this.id, data).subscribe(
      (response) => {
        toastr.success('Dados atualizados com sucesso.');
        this.loadCompanies(); 
      },
      (error) => {
        const errorMessage = this.getDetailedErrorMessage(error);
        toastr.error(errorMessage, 'Erro');
        toastr.error('Ocorreu um erro, entre em contato com o administrador.', 'Erro');
      },
      () => {
        this.loading = false;
        this.loaderService.load(this.loading);
        this.isEditCompanyModalOpen = false;
      }
    );
  }   

  public onSubmitCadastro(): void {
    this.loading = true;
    this.loaderService.load(this.loading);
  
    this.validateRelevantFields(this.form);
  
    const data = this.form.value;
  
    data.cnpj = this.unmaskCnpj(data.cnpj);
    data.cac = this.unmaskCurrency(data.cac);
    data.ltv = this.unmaskCurrency(data.ltv);
    data.cmv = this.unmaskCurrency(data.cmv);
  
    data.address.zipCode = this.unmaskInput(data.address.zipCode);
  
    const rawDate = data.responsible.dateOfBirth;
  
    if (rawDate) {
      data.responsible.dateOfBirth = this.formatDateToISO(rawDate);
    } else {
      toastr.error("Data de nascimento não preenchida ou inválida.");
      this.loading = false;
      this.loaderService.load(this.loading);
      return;
    }
  
    data.responsible.cpf = this.unmaskInput(data.responsible.cpf);
    data.responsible.phone = this.unmaskInput(data.responsible.phone);
    data.responsible.rg = this.unmaskInput(data.responsible.rg);
  
    data.type = "SIMPLE";
    data.category = "TRACTION";
  
    delete data.partners;
  
    this.companyService.createCompany(data).subscribe(
      (response) => {
        toastr.success('Dados enviados com sucesso.');
        this.loadCompanies();
      },
      (error) => {
        const errorMessage = this.getDetailedErrorMessage(error);
        toastr.error(errorMessage, 'Erro');
        toastr.error('Ocorreu um erro, entre em contato com o administrador.', 'Erro');
      },
      () => {
        this.loading = false;
        this.isSingUpCompanyModalOpen = false;
        this.loaderService.load(this.loading);
      }
    );
  }
  
  private validateRelevantFields(formGroup: FormGroup): void {
    const ignoredFields = [
      'category',
      'type',
      'nire',
      'cnae',
      'legalType',
      'yearOfIncorporation',
      'generalInfo',
      'revenueModel',
      'customersDescription',
      'competitors',
      'benchmarks',
      'numberOfCustomers',
      'payingCustomers',
      'grossRevenue',
      'operations',
      'partners',
      'totalExpenditure',
      'investments',
      'investmentsDeposited',
      'incubation',
      'valuation',
      'roundValue',
      'providers',
      'contractModel',
      'hasDividends',
      'video',
      'pitch',
      'facebook',
      'linkedin',
      'twitter',
      'averageTicket',
      'ltvCac',
      'cashburnIndicator',
      'sharePriceIndicator'
    ];
  
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        if (!ignoredFields.includes(field) && control.invalid) {
          control.markAsTouched({ onlySelf: true });
        }
      } else if (control instanceof FormGroup) {
        this.validateRelevantFields(control); 
      } else if (control instanceof FormArray) {
        control.controls.forEach((group) => {
          if (group instanceof FormGroup) {
            this.validateRelevantFields(group);
          }
        });
      }
    });
  }
  
  
  private formatDateToISO(date: string): string {
    try {
      const cleanedDate = date.trim();
  
      const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (isoDateRegex.test(cleanedDate)) {
        return cleanedDate;
      }
  
      const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
      if (!dateRegex.test(cleanedDate)) {
        throw new Error("Formato de data inválido. Use dd/MM/yyyy.");
      }
  
      const [day, month, year] = cleanedDate.split('/').map(Number);
      if (!day || !month || !year) {
        throw new Error("Data incompleta.");
      }
  
      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    } catch (error) {
      console.error("Erro ao formatar a data:", error);
      return "";
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

  public getCompany(id: number): void {
    this.id = id;
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
          this.totalCompanies = this.filteredCompanies.length; 
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
    this.isUpdateCompanyModalOpen = false;
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
    $(".dateOfBirth").mask("00/00/0000");
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

  exportToCSV() {
    const companies = this.filteredCompanies; 
    if (companies && companies.length > 0) {
      const csvData = this.convertToCSV(companies);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'empresas.csv'); 

      // Alternativa usando JavaScript puro (sem FileSaver.js)
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.setAttribute('href', url);
      // a.setAttribute('download', 'empresas.csv');
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);
    }
  }

  convertToCSV(objArray: any[]): string {
    const header = ['Empresa', 'Responsável', 'CNPJ', 'Modelo']; 
    const rows = objArray.map(company => [
      company.name,
      company.responsible.name,
      company.cnpj,
      this.maskModel(company.model) 
    ]);

    const csvContent = [header, ...rows]
      .map(row => row.join(','))
      .join('\n');

    return csvContent;
  }

  formatDate() {
    const control = this.form.get('responsible.dateOfBirth');
    let date = control?.value;
  
    if (date) {
      date = date.replace(/\D/g, '');

      if (date.length > 2) {
        date = date.substring(0, 2) + '/' + date.substring(2);
      }
      if (date.length > 5) {
        date = date.substring(0, 5) + '/' + date.substring(5, 9);
      }
  
      control?.setValue(date, { emitEvent: false });
    }
  }

  validateDate() {
    const dateControl = this.form.controls["responsible.dateOfBirth"];
    const date = dateControl?.value;
  
    if (!date) {
      this.showErrorDialog("Insira uma data de nascimento válida.");
      return false;
    }
  
    const ExpReg = new RegExp(
      "^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/([12][0-9]{3})$"
    );
  
    if (!ExpReg.test(date)) {
      this.showErrorDialog("Insira uma data de nascimento válida no formato dd/mm/yyyy.");
      dateControl.setValue("");
      return false;
    }
  
    const [day, month, year] = date.split("/").map(Number);
  
    if (
      (month === 4 || month === 6 || month === 9 || month === 11) && day > 30 || 
      (month === 2 && ((day > 28 && year % 4 !== 0) || day > 29)) ||
      day > 31 
    ) {
      this.showErrorDialog("Insira uma data de nascimento válida.");
      dateControl.setValue("");
      return false;
    }
  
    return true;
  }
  
  private showErrorDialog(message: string) {
    toastr.error(message, "Campo incorreto");
  }
  
  async fetchAddressByCEP(cep: string): Promise<void> {
    const numericCep = cep.replace(/\D/g, '');
  
    if (!numericCep || numericCep.length !== 8) {
      toastr.error('Insira um CEP válido.');
      return;
    }
  
    try {
      const response = await fetch(`https://viacep.com.br/ws/${numericCep}/json/`);
      const data = await response.json();
  
      if (data.erro) {
        toastr.error('CEP não encontrado.');
        return;
      }
  
      this.form.patchValue({
        address: {
          street: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          uf: data.uf || '',
          complemento: data.complemento || ''
        }
      });
  
      toastr.success('Endereço encontrado com sucesso!');
    } catch (error) {
      console.error('Erro ao buscar o endereço:', error);
      toastr.error('Erro ao buscar o endereço. Tente novamente.');
    }
  }

  onZipCodeInput(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
  
    value = value.replace(/\D/g, '');
  
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d{1,3})/, '$1-$2');
    }
  
    input.value = value; 
  
    if (value.length === 9) {
      this.fetchAddressByCEP(value.replace('-', ''));
    }
  }

  validateZipCode(zipCode: string): void {
    const isValid = /^\d{8}$/.test(zipCode);

    if (isValid) {
      toastr.success('CEP válido!', 'Sucesso');
    } else {
      toastr.error('CEP inválido. Tente novamente.', 'Erro');
    }
  }

  onRGInput(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
  
    value = value.replace(/\D/g, '');
  
    value = value.substring(0, 10);
  
    if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d)/, '$1.$2');
    }
    if (value.length > 6) {
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    }
    if (value.length > 9) {
      value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    }
  
    input.value = value;
  }  

  onCPFInput(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
  
    value = value.replace(/\D/g, '');
  
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
  
    if (value.length > 9) {
      value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      value = value.replace(/^(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (value.length > 3) {
      value = value.replace(/^(\d{3})(\d{1,3})/, '$1.$2');
    }
  
    input.value = value;
  }

  onPhoneInput(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
  
    value = value.replace(/\D/g, '');
  
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
  
    if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{1,4})/, '($1) $2');
    } else if (value.length > 0) {
      value = value.replace(/^(\d{1,2})/, '($1');
    }
  
    input.value = value;
  }  

  onCNPJInput(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
  
    value = value.replace(/\D/g, '');
  
    value = value.substring(0, 14);
  
    if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d)/, '$1.$2');
    }
    if (value.length > 5) {
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    }
    if (value.length > 8) {
      value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4');
    }
    if (value.length > 12) {
      value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');
    }
  
    input.value = value;
  }

  onCurrencyInput(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
  
    value = value.replace(/\D/g, '');
  
    const numericValue = (Number(value) / 100).toFixed(2);
    const parts = numericValue.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
    input.value = `R$ ${parts.join(',')}`; 
  }

  onCaptableInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
  
    value = value.replace(/\D/g, '');
  
    const numericValue = (Number(value) / 100).toFixed(2);
  
    const parts = numericValue.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    input.value = parts.join(',');
  
    const controlName = input.getAttribute('formControlName');
    if (controlName) {
      this.captableForm.get(controlName).setValue(input.value, { emitEvent: false });
    }
  }
  
  
}
