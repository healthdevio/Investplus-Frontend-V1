import { Component, OnInit } from "@angular/core";
import { RoundService } from "../../../../core/service/round.service";
import { Router } from "@angular/router";
import { TitleService } from "../../../../core/service/title.service";
import { TitleHeader } from "../../../../core/interface/title-header";
import { DomSanitizer } from "@angular/platform-browser";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { TiposModalidades } from './../../../../core/enums/modalidades.enum';
import { CompanyService } from '../../../../core/service/company.service';
import { LoaderService } from './../../../../core/service/loader.service';
import { finalize } from 'rxjs/operators';
import { RealStateService } from '../../../../core/service/real-state.service';
import { saveAs } from 'file-saver';
import { Modality, ModalityService } from '../../../../core/service/modality.service';

declare var toastr: any;
declare var bootbox: any;

@Component({
  selector: "app-round-company-publish",
  templateUrl: "./round-company-publish.component.html",
  styleUrls: ["./round-company-publish.component.css"],
})
export class RoundCompanyPublishComponent implements OnInit {
  titleHeader: TitleHeader;
  rounds: any;
  form: FormGroup;
  formStatus: FormGroup;
  loadingRounds = false;
  updateForm: FormGroup;
  status = "IN_PROGRESS";
  tabType = 'IN_PROGRESS';
  companies = [];
  modalities: Modality[] = [];
  isSingUpPublishModalOpen = false;
  isUpdatePublishModalOpen = false;
  statusApproved = { status: "IN_PROGRESS" };
  isDropdownVisible: number | null = null;
  loader: boolean;
  id = 0;
  responseError: boolean;
  textRegister = "Nenhum registro encontrado.";
  p = 1;
  responsive = true;
  labels: any = {
    previousLabel: "Anterior",
    nextLabel: "Próximo",
  };
  filteredCompanies: []

  singUpPublishSessions = [
    {
      name: "Geral"
    },
    {
      name: "Valores"
    },
    {
      name: "Resumo"
    },
    {
      name: "Documentos"
    },
  ]

  upDatePublishSessions = [
    {
      name: "Geral"
    },
    {
      name: "Valores"
    },
    {
      name: "Resumo"
    },
    {
      name: "Documentos"
    },
  ]

  selectedSession = "Geral";
  selectedUpdateSession = "Geral";

  constructor(
    private roundService: RoundService,
    private roundService2: RealStateService,
    private router: Router,
    private data: TitleService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private companyService: CompanyService,
    private loaderService: LoaderService,
    private modalityService: ModalityService,
  ) { }

  ngOnInit() {
    this.data.currentMessage.subscribe((titles) => (this.titleHeader = titles));
    this.titleHeader.title = "Administração / Publicar Rodada";
    this.data.changeTitle(this.titleHeader);
    this.initStatus();
    this.getAllByStatus();
    this.initForm();
    this.loadCompanies();
    this.initUpdateForm();
    this.getModalities();
  }

  loadCompanies() {
    this.companies = [];
    this.getAllCompaniesByStatus(true);
  }

  private getAllCompaniesByStatus(status: any): void {
    this.companyService.getAllByActiveStatus(status).subscribe(
      (response) => {
        for (const company of response) {
          this.companies.push(company);
        }
      },
    );
  }

  getRoundInformation(id: number, roundId: number) {
    this.isUpdatePublishModalOpen = true
    this.loadingRounds = true;
    this.id = id;
    this.roundService
      .getRound(id, roundId)
      .subscribe({
        next: (response) => {
          const dataForm = response.round as any;
          this.updateForm.patchValue(dataForm);
          this.adjustDurationDate();
          this.loadingRounds = false;
        }
      })
  }

  getModalities() {
    this.modalities = this.modalityService.getModalities();
  }

  initStatus() {
    this.formStatus = this.formBuilder.group({
      status: [this.status]
    })
  }

  changeTabType(tabType: string) {
    this.tabType = tabType;
    this.status = tabType;
    this.getAllByStatus();
  }


  toggleDropdown(index: number) {
    this.isDropdownVisible = this.isDropdownVisible === index ? null : index;
  }

  toggleTab() {
    this.formStatus.get('status').value === 'IN_PROGRESS' ? this.formStatus.get('status').setValue('PENDING') : this.formStatus.get('status').setValue('IN_PROGRESS');
    this.status = this.formStatus.get('status').value;
    this.getAllByStatus();
  }

  openSingUpModal() {
    this.updateForm.reset();
    this.isSingUpPublishModalOpen = true;
  }

  adjustDurationDate() {
    const duration = this.updateForm.get('duration').value;
    const startDate = new Date(this.updateForm.get('startedAt').value);
    startDate.setDate(startDate.getDate() + duration);
    const adjustedDate = startDate.toISOString().split('T')[0];

    this.updateForm.get('duration').setValue(adjustedDate);
  }

  uploadFile(evt: any, fieldName: string, fieldDoc: string) {
    const file = evt.target.files[0];
    const fileName = file.name;
    if (file) {
      if (file.size > 52428800) {
        toastr.error("O tamanho máximo permitido é 50MB.");
      } else {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const dataSend = {
            file: btoa(e.target.result),
            name: fileName
          };

          this.companyService
            .uploadDocs(this.id, dataSend)
            .subscribe({
              next: (response: any) => {
                this.updateForm.get(fieldName).setValue(fileName);
                this.updateForm.get(fieldDoc).setValue(response.url);
              },
              error: (error: any) => {
                toastr.error(error)
              }
            })
        }
        reader.readAsBinaryString(file);
      }
    }
  }

  initForm() {
    this.form = this.formBuilder.group({
      property: [null, [Validators.required]],
      builder: [null, [Validators.required]],
      offerVideo: [null, [Validators.required]],
      annualMinProfitability: [null],//, [Validators.required]],
      annualMaxProfitability: [null],//, [Validators.required]],
      minimalProfitability: [null],//, [Validators.required]],
      minimumCaptation: [null],//, [Validators.required]],
      maximumCaptation: [null],//, [Validators.required]],
      projectedMinProfitability: [null, [Validators.required]],
      projectedMaxProfitability: [null, [Validators.required]],
      returnTimeInMonths: [null, [Validators.required]],
      quotaValue: [null, [Validators.required]],
      quotas: [null, [Validators.required]],
      duration: [null, [Validators.required]],
      location: [null, [Validators.required]],
      locationLink: [null, [Validators.required]],
      riskiness: [null, [Validators.required, Validators.maxLength(4000)]],
      description: [null, [Validators.required, Validators.maxLength(4000)]],
      business: [null, [Validators.required, Validators.maxLength(4000)]],
      achievements: [null, [Validators.required, Validators.maxLength(4000)]],

      logo: [null, [Validators.required]],
      logoDocUrl: [null, [Validators.required]],
      banner: [null],
      bannerDocUrl: [null],

      roundDocUrl: [null],
      roundDoc: [null],

      builderDocUrl: [null],
      builderDoc: [null],

      propertyDocUrl: [null],
      propertyDoc: [null],

      viabilityDocUrl: [null],
      viabilityDoc: [null],

      taxationDocUrl: [null],
      taxationDoc: [null],

      legalDocUrl: [null],
      legalDoc: [null],

      totalApartments: [null, [Validators.required]],
      availableApartments: [null, [Validators.required]]
    });

  }

  initUpdateForm() {
    this.updateForm = this.formBuilder.group({
      id: [null],
      status: [null],
      type: [null, [Validators.required]],
      token: [null],
      offerVideo: [null, [Validators.required]],
      minimumValuation: [null, [Validators.required]],
      maximumValuation: [null, [Validators.required]],
      quotaValue: [null, [Validators.required]],
      logo: [null, [Validators.required]],
      banner: [null],
      quotas: [null, [Validators.required]],
      duration: [null, [Validators.required]],
      deadline: [null, [Validators.required]],
      partnerParticipation: [null, [Validators.required]],
      business: [null, [Validators.required, Validators.maxLength(4000)]],
      achievements: [null, [Validators.required, Validators.maxLength(4000)]],
      potentialMarket: [null, [Validators.required, Validators.maxLength(4000)]],
      targets: [null, [Validators.required, Validators.maxLength(4000)]],
      roadmap: [null, [Validators.required, Validators.maxLength(4000)]],
      riskiness: [null, [Validators.required, Validators.maxLength(4000)]],
      presentationOffer: [null],
      presentationInvestors: [null],
      legalDocuments: [null],
      valuationDoc: [null],
      reputationalDossier: [null],
      fiscalDossier: [null],
      expansionPlan: [null],
      documentsFile: [null],
      cdiPercentage: [null],
      cdiValue: [null],
      startedAt: [null, [Validators.required]],
      percentageOfIncome: [null],
      upangelCost: [null, [Validators.required]],
      modality: [null, [Validators.required]],
      guarantee: [null, [Validators.required]],
      valuation: [null],
      docExpansionPlan: [null],
      docFiscalDossier: [null],
      docPresentationOffer: [null],
      docPresentationInvestors: [null],
      docReputationalDossier: [null],
      docValuation: [null],
      docLegalDocuments: [null],
      docLogo: [null, [Validators.required]],
      docBanner: [null],
      docTypeExpansionPlan: [null],
      docTypeFiscalDossier: [null],
      docTypeReputationalDossier: [null],
      docTypeValuation: [null],
      docTypeLegalDocuments: [null],
      docTypeLogo: [null],
      docTypeBanner: [null],
      docTypePresentationOffer: [null],
      docTypePresentationInvestors: [null],
      docInvestmentContract: [null],
      investmentContract: [null],
    });
  }

  selectSession(sessionName: string) {
    this.selectedSession = sessionName;
  }

  selectUpdateSession(sessionName: string) {
    this.selectedUpdateSession = sessionName;
  }

  onCompanyChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.id = Number(selectElement.value);
  }

  getAllByStatus(){
    this.responseError = false;
    this.loader = true;
    this.rounds = [];
    this.roundService.getAllByStatus(this.tabType).subscribe(
      (response) => {
        console.log(response.companiesRounds)
        if (
          response.companiesRounds == null ||
          response.companiesRounds.length === 0
        ) {
          this.responseError = true;
          this.rounds = response.companiesRounds
          this.filteredCompanies = response.companiesRounds;
          this.loader = false;
          return;
        }
        this.rounds = response.companiesRounds
        this.filteredCompanies = response.companiesRounds;
        this.loader = false;
      },
      (error) => {
        this.loader = false;
        this.responseError = true;
      }
    );
  }

  filterCompanies(searchTerm: string) {
    if (searchTerm) {
      this.filteredCompanies = this.rounds.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      this.filteredCompanies = this.rounds;
    }
  }

  exportToCSV() {
    const roundsFilteres = this.filteredCompanies;
    if (roundsFilteres && roundsFilteres.length > 0) {
      const csvData = this.convertToCSV(roundsFilteres);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'rodadas.csv');

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

  public maskModel(model: string): string {
    const aux = TiposModalidades[model];
    if (!aux) {
      return "";
    }
    return aux;
  }

  calculateEndDate(startedAt: string, duration: number): string {

    if (!startedAt || !duration) return '';
    const startedDate = new Date(startedAt); 
    const endDate = new Date(startedDate);
    endDate.setDate(startedDate.getDate() + duration);

    const year = endDate.getFullYear();
    const month = String(endDate.getMonth() + 1).padStart(2, '0');
    const day = String(endDate.getDate()).padStart(2, '0');

    return `${day}/${month}/${year}`;
  }

  public onSubmit(): void {
    if (this.updateForm.valid) {
      const $this = this;
      const dataForm = this.updateForm.value;
      const startedAt = new Date(dataForm.startedAt);
      const duration = new Date(dataForm.duration);
      const timeDifference = duration.getTime() - startedAt.getTime();
      const daysDifference = timeDifference / (1000 * 3600 * 24);
      dataForm.duration = daysDifference;
      this.roundService.createRound(this.id, dataForm).subscribe((response) => {
        bootbox.dialog({
          title: '',
          message: 'Rodada atualizada com sucesso.',
          buttons: {
            'success': {
              label: 'Entendi',
              className: 'bg-upangel',
            }
          }
        });

        this.isSingUpPublishModalOpen = false;
        this.isUpdatePublishModalOpen = false;
        this.updateForm.reset();
        this.initForm();
        this.getAllByStatus();
      }, (error) => {
        toastr.error('Ocorreu um erro, entre em contato com o administrador', 'Erro');
      }, () => {
        // this.loading = true;
        // this.loaderService.load(this.loading);
      });
    } else {
      this.validateAllFields(this.updateForm);
      this.initMask();
      toastr.error('Formulário preenchido incorretamente. Por favor revise seus dados.');
    }
  }

  public initMask(): void {
    const SPMaskBehavior = function (val: string) {
      return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-0000';
    },
      spOptions = {
        onKeyPress: function (val: string, e: KeyboardEvent, field: any, options: any) {
          field.mask(SPMaskBehavior.apply({}, arguments), options);
        }
      };

    $('.number').keyup(function () {
      const inputElement = this as HTMLInputElement;
      inputElement.value = inputElement.value.replace(/\D/g, '');
    });
  }

  formatCNPJ(cnpj: string): string {
    if (!cnpj) return '';

    cnpj = cnpj.replace(/\D/g, '');

    if (cnpj.length !== 14) return cnpj;

    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }

  formatPhoneNumber(phone: string): string {
    if (!phone) return '';
    phone = phone.replace(/\D/g, '');

    if (phone.length > 11) {
      phone = phone.substr(0, 11);
    }

    if (phone.length === 11) {
      return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (phone.length === 10) {
      return phone.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    }

    return phone;
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

  publishRound(company, round) {
    const $this = this;
    this.roundService
      .updateStatus(company, round, this.statusApproved)
      .subscribe(
        (response) => {
          bootbox.dialog({
            title: "",
            message: "A rodada foi publicada.",
            buttons: {
              success: {
                label: "Entendi",
                className: "bg-upangel",
                callback: function () {
                  $this.router.navigate(["/admin/rounds/incorporator/list"]);
                },
              },
            },
          });
        },
        (error) => {
          const erro = "Ocorreu um erro, entre em contato com o administrador.";
          toastr.options = {
            closeButton: true,
            debug: false,
            newestOnTop: false,
            progressBar: true,
            positionClass: "toast-top-center",
            preventDuplicates: true,
            onclick: null,
            showDuration: "300",
            hideDuration: "1000",
            timeOut: "10000",
            extendedTimeOut: "1000",
            showEasing: "swing",
            hideEasing: "linear",
            showMethod: "fadeIn",
            hideMethod: "fadeOut",
          };
          toastr.error(erro, "Erro");
        }
      );
  }

  finishRound(company, round) {
    const $this = this;
    this.roundService
      .updateStatus(company, round, { status: "FINISHED" })
      .subscribe(
        (response) => {
          bootbox.dialog({
            title: "",
            message: "rodada finalizada com sucesso.",
            buttons: {
              success: {
                label: "Entendi",
                className: "bg-upangel",
              },
            },
          });
        },
        (error) => {
          const erro = "Ocorreu um erro, entre em contato com o administrador.";
          toastr.options = {
            closeButton: true,
            debug: false,
            newestOnTop: false,
            progressBar: true,
            positionClass: "toast-top-center",
            preventDuplicates: true,
            onclick: null,
            showDuration: "300",
            hideDuration: "1000",
            timeOut: "10000",
            extendedTimeOut: "1000",
            showEasing: "swing",
            hideEasing: "linear",
            showMethod: "fadeIn",
            hideMethod: "fadeOut",
          };
          toastr.error(erro, "Erro");
        }
      );
  }
}
