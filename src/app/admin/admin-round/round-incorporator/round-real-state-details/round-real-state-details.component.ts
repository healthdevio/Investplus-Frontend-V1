import { LoaderService } from './../../../../core/service/loader.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { RealState } from '../../../../core/interface/real-state';
import { RealStateService } from '../../../../core/service/real-state.service';
import { TitleService } from '../../../../core/service/title.service';
import { TitleHeader } from '../../../../core/interface/title-header';
import { CompanyService } from '../../../../core/service/company.service';
import { finalize } from 'rxjs/operators';

declare var $: any;
declare var toastr: any;
declare var bootbox: any;

@Component({
  selector: 'app-round-real-state-details',
  templateUrl: './round-real-state-details.component.html',
  styleUrls: ['./round-real-state-details.component.css']
})
export class RoundRealStateDetailsComponent implements OnInit {

  form: FormGroup;
  textValidator = ' é obrigatório.';
  realState: RealState;
  titleHeader: TitleHeader;

  loading: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private roundService: RealStateService,
    private router: Router,
    private data: TitleService,
    private loaderService: LoaderService,
    private companyService: CompanyService
  ) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(titles => this.titleHeader = titles);
    this.titleHeader.title = 'Administração / Criar Rodada';
    this.data.changeTitle(this.titleHeader);
    this.initForm();

    const $this = this;
    setTimeout(function () {
      $this.initMask();
    }, 500);
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
      logoDocUrl: [null],
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

  initMask() {

    const SPMaskBehavior = function (val) {
      return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
    },
      spOptions = {
        onKeyPress: function (val, e, field, options) {
          field.mask(SPMaskBehavior.apply({}, arguments), options);
        }
      };

    $('.money').mask('#.##0,00', {
      reverse: true
    });
    $('.number').keyup(function () {
      $(this).val(this.value.replace(/\D/g, ''));
    });
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

      this.loading = true;
      this.loaderService.load(this.loading);
      this.roundService.createRound(this.form.value).pipe(finalize(() => this.loading = false)).subscribe((response) => {
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

  uploadFile(evt: any, fieldName: string, fieldDoc: string){
    const file = evt.target.files[0];
    const fileName = file.name;
    if (file) {
      if (file.size > 2097152) {
        toastr.error("O tamanho máximo permitido é 2MB.");
      } else {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          /* this.form.get(fieldName).setValue(fileName);
          this.form.get(fieldDoc).setValue(btoa(e.target.result)); */
          const dataSend = {
            file: btoa(e.target.result),
            name: fileName
          };

          this.companyService
            .uploadDocs(0, dataSend)
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
