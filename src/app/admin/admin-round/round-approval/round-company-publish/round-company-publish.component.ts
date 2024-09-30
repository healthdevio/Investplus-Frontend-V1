import { Component, OnInit } from "@angular/core";
import { RoundService } from "../../../../core/service/round.service";
import { Router } from "@angular/router";
import { TitleService } from "../../../../core/service/title.service";
import { TitleHeader } from "../../../../core/interface/title-header";
import { DomSanitizer } from "@angular/platform-browser";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { CompanyService } from '../../../../core/service/company.service';
import { LoaderService } from './../../../../core/service/loader.service';
import { finalize } from 'rxjs/operators';
import { RealStateService } from '../../../../core/service/real-state.service';
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
  updateForm: FormGroup;
  status = "IN_PROGRESS";
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

  singUpPublishSessions = [
    {
      name: "Geral"
    },
    {
      name: "Detalhes"
    },
    {
      name: "Localização"
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
    this.initUpdateForm();
    this.getModalities();
  }

  getModalities() {
    this.modalities = this.modalityService.getModalities();
  }

  initStatus() {
    this.formStatus = this.formBuilder.group({
      status: [this.status]
    })
  }

  toggleDropdown(index: number) {
    this.isDropdownVisible = this.isDropdownVisible === index ? null : index;
  }

  toggleTab() {
    this.formStatus.get('status').value === 'IN_PROGRESS' ? this.formStatus.get('status').setValue('PENDING') : this.formStatus.get('status').setValue('IN_PROGRESS');
    this.status = this.formStatus.get('status').value;
    this.getAllByStatus();
  }

  updateRound(id: number, roundId: number) {
    this.roundService
      .getRound(id, roundId)
      .subscribe({
        next: (response) => {
          const dataForm = response.round as any;
          this.updateForm.patchValue(dataForm);
          this.adjustDurationDate();
        }
      })
    this.isUpdatePublishModalOpen = true
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
                this.form.get(fieldName).setValue(fileName);
                this.form.get(fieldDoc).setValue(response.url);
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

  consoleTeste() {
    console.log(this.form.get('legalDoc').value)
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
      startedAt: [null],
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
      docLogo: [null],
      docBanner: [null],
      docTypeExpansionPlan: [null],
      docTypeFiscalDossier: [null],
      docTypeReputationalDossier: [null],
      docTypeValuation: [null],
      docTypeLegalDocuments: [null],
      docTypeLogo: [null],
      docTypeBanner: [null],
      docTypePresentationOffer: [null],
      docTypePresentationInvestors: [null]
    });
  }

  selectSession(sessionName: string) {
    this.selectedSession = sessionName;
  }

  selectUpdateSession(sessionName: string) {
    this.selectedUpdateSession = sessionName;
  }

  getAllByStatus(){
    this.responseError = false;
    this.loader = true;
    this.rounds = [];
    this.roundService.getAllByStatus(this.formStatus.get('status').value).subscribe(
      (response) => {
        if (
          response.companiesRounds == null ||
          response.companiesRounds.length === 0
        ) {
          this.responseError = true;
          this.loader = false;
          return;
        }
        this.rounds = [...response.companiesRounds, ...response.realStateRounds]
        this.loader = false;
      },
      (error) => {
        this.loader = false;
        this.responseError = true;
      }
    );
  }

  onSubmit() {
    if (this.form.valid) {
      const $this = this;

      // this.form.controls['annualMinProfitability'].setValue((Number(this.form.controls['annualMinProfitability']?.value?.replace(/[^\d]+/g, '')) / 100).toFixed(2));
      // this.form.controls['annualMaxProfitability'].setValue((Number(this.form.controls['annualMaxProfitability']?.value?.replace(/[^\d]+/g, '')) / 100).toFixed(2));
      // this.form.controls['minimalProfitability'].setValue((Number(this.form.controls['minimalProfitability'].value.replace(/[^\d]+/g, '')) / 100).toFixed(2));
      this.form.controls['projectedMinProfitability'].setValue((Number(this.form.controls['projectedMinProfitability'].value.replace(/[^\d]+/g, '')) / 100).toFixed(2));
      this.form.controls['projectedMaxProfitability'].setValue((Number(this.form.controls['projectedMaxProfitability'].value.replace(/[^\d]+/g, '')) / 100).toFixed(2));
      this.form.controls['quotaValue'].setValue((Number(this.form.controls['quotaValue'].value.replace(/[^\d]+/g, '')) / 100).toFixed(2));
      this.form.controls['returnTimeInMonths'].setValue(this.form.controls['returnTimeInMonths'].value.replace(/[^\d]+/g, ''));
      this.form.controls['quotas'].setValue(this.form.controls['quotas'].value.replace(/[^\d]+/g, ''));
      this.form.controls['duration'].setValue(this.form.controls['duration'].value.replace(/[^\d]+/g, ''));
      this.form.controls['totalApartments'].setValue(this.form.controls['totalApartments'].value.replace(/[^\d]+/g, ''));
      this.form.controls['availableApartments'].setValue(this.form.controls['availableApartments'].value.replace(/[^\d]+/g, ''));

      this.loader = true;
      this.loaderService.load(this.loader);
      this.roundService2.createRound(this.form.value).pipe(finalize(() => this.loader = false)).subscribe((response) => {
        bootbox.dialog({
          title: '',
          message: 'Rodada criada com sucesso.',
          buttons: {
            'success': {
              label: 'Entendi',
              className: 'bg-upangel',
              callback: function () {
                $this.router.navigate(['/admin/rounds/approval/incorporator/publish']);
              }
            }
          }
        });
        this.isSingUpPublishModalOpen = false
      }, (error) => {
        const erro = 'Ocorreu um erro, entre em contato com o administrador.';
        toastr.options = {
          'closeButton': true,
          'debug': false,
          'newestOnTop': false,
          'progressBar': true,
          'positionClass': 'toast-top-center',
          'preventDuplicates': true,
          'onclick': null,
          'showDuration': '300',
          'hideDuration': '1000',
          'timeOut': '10000',
          'extendedTimeOut': '1000',
          'showEasing': 'swing',
          'hideEasing': 'linear',
          'showMethod': 'fadeIn',
          'hideMethod': 'fadeOut'
        };
        toastr.error(erro, 'Erro');
      }, () => {
        this.loader = false;
        this.loaderService.load(this.loader);
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
}
