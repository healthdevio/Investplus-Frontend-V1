import { LoaderService } from './../../../../core/service/loader.service';
import { NumberMaskPipe } from './../../../../core/pipes/number-mask.pipe';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../../../core/service/company.service';
import { Company } from '../../../../core/interface/company';
import { Round } from '../../../../core/interface/round';
import { RoundService } from '../../../../core/service/round.service';
import { TitleService } from '../../../../core/service/title.service';
import { TitleHeader } from '../../../../core/interface/title-header';
import { Modality, ModalityService } from '../../../../core/service/modality.service';

declare var $: any;
declare var toastr: any;
declare var bootbox: any;

@Component({
  selector: 'app-round-company-details',
  templateUrl: './round-company-details.component.html',
  styleUrls: ['./round-company-details.component.css']
})
export class RoundCompanyDetailsComponent implements OnInit {

  titleHeader: TitleHeader;
  form: FormGroup;
  textValidator = ' é obrigatório.';
  company: Company;
  round: Round;
  id: number;
  idRound: number;
  nameCompany: string;
  buttonText: string;  // Adicione esta linha

  loading: boolean = false;

  modalities: Modality[] = [];

  constructor(private formBuilder: FormBuilder,
    private activedRouter: ActivatedRoute,
    private companyService: CompanyService,
    private roundService: RoundService,
    private data: TitleService,
    private modalityService: ModalityService,
    private router: Router  // Adicione esta linha
  ) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(titles => this.titleHeader = titles);
    this.titleHeader.title = 'Administração / Atualizar Rodada';
    this.getModalities();
    this.data.changeTitle(this.titleHeader);
    this.initForm();
    this.id = this.activedRouter.snapshot.params['id'];
    this.idRound = this.activedRouter.snapshot.params['idRound'];

    // Defina o texto do botão com base na rota
    this.setButtonText();

    if(this.idRound){
      this.roundService
        .getRound(this.id, this.idRound)
        .subscribe({
          next: (response)=>{
            const dataForm = response.round as any;
            this.form.patchValue(dataForm);
          }
        })
      return;
    }

    if (this.id) {
      this.getCompany(this.id);
    }

    const $this = this;
    setTimeout(function () {
      $this.initMask();
    }, 1000);
  }

  setButtonText() {
    const currentUrl = this.router.url;
    if (currentUrl.includes('update')) {
      this.buttonText = 'Atualizar Rodada';
    } else if (currentUrl.includes('create')) {
      this.buttonText = 'Publicar Rodada';
    }
  }

  getModalities() {
    this.modalities = this.modalityService.getModalities();
  }

  initForm() {
    this.form = this.formBuilder.group({
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
      partnerParticipation: [null],
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

  public onDocumentoFileChange(file: File | null) {
    this.form.get('documentsFile').setValue(file);
  }

  private getCompany(id): void {
    this.companyService.getCompany(id).subscribe((response) => {
      this.company = response;
      this.nameCompany = response.name;
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

    $('.number').keyup(function () {
      $(this).val(this.value.replace(/\D/g, ''));
    });
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const $this = this;
      const dataForm = this.form.value;

      this.loading = true;
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
      }, (error) => {
        toastr.error('Ocorreu um erro, entre em contato com o administrador', 'Erro');
      }, () => {
        // this.loading = true;
        // this.loaderService.load(this.loading);
      });
    } else {
      this.validateAllFields(this.form);
      this.initMask();
      toastr.error('Formulário preenchido incorretamente. Por favor revise seus dados.');
    }
  }

  public validateAllFields(formGroup: FormGroup): any {
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

  public unmaskInput(input: any): any {
    return input.replace(/[^\d]+/g, '');
  }

  uploadFile(evt: any, fieldName: string, fieldDoc: string){
    const file = evt.target.files[0];
    const fileName = file.name;
    if (file) {
      if (file.size > 2097152) {
        toastr.error("O tamanho máximo permitido é 2MB.");
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
}
