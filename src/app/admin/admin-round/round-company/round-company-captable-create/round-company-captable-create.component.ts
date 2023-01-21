import { LoaderService } from './../../../../core/service/loader.service';
import { MoneyMaskPipe } from './../../../../core/pipes/money-mask.pipe';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyCaptable } from '../../../../core/interface/company-captable';
import { CompanyCaptableService } from '../../../../core/service/company-captable.service';
import { TitleService } from '../../../../core/service/title.service';
import { TitleHeader } from '../../../../core/interface/title-header';

declare var $: any;
declare var moment: any;
declare var toastr: any;

@Component({
  selector: 'app-round-company-captable-create',
  templateUrl: './round-company-captable-create.component.html',
  styleUrls: ['./round-company-captable-create.component.css']
})
export class RoundCompanyCaptableCreateComponent implements OnInit {

  titleHeader: TitleHeader;
  form: FormGroup;
  loader: boolean;
  captable: CompanyCaptable;
  company = 0;

  loading: boolean = false;

  constructor(
    private activedRouter: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private captableService: CompanyCaptableService,
    private data: TitleService,
    private maskMoney: MoneyMaskPipe,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {

    this.data.currentMessage.subscribe(titles => this.titleHeader = titles);
    this.titleHeader.title = 'Administração / Captable';
    this.data.changeTitle(this.titleHeader);

    this.loader = true;

    this.activedRouter.params.subscribe(params => {
      this.company = params['id'];
    });

    this.initForm();
    this.getCaptable();
    this.initMask();
  }

  initForm() {
    this.form = this.formBuilder.group({
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
    $('.dateOfBirth').mask('00/00/0000');
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
      this.captableService.createCaptable(this.company, dataSend).subscribe((response) => {
        toastr.success('Dados enviados.');
        this.redirectTo('admin/rounds/company/captable/' + this.company);
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

  getCaptable() {
    this.captableService.getCaptable(this.company).subscribe((response) => {
      this.captable = response;

      this.form.controls['id'].setValue(response.id);
      this.form.controls['founders'].setValue(this.maskMoney.transform(response.founders));
      this.form.controls['coFounders'].setValue(this.maskMoney.transform(response.coFounders));
      this.form.controls['vesting'].setValue(this.maskMoney.transform(response.vesting));
      this.form.controls['accelerator'].setValue(this.maskMoney.transform(response.accelerator));
      this.form.controls['crowdfunding'].setValue(this.maskMoney.transform(response.crowdfunding));
      this.form.controls['angel'].setValue(this.maskMoney.transform(response.angel));
      this.form.controls['venture1'].setValue(this.maskMoney.transform(response.venture1));
      this.form.controls['venture2'].setValue(this.maskMoney.transform(response.venture2));
      this.form.controls['venture3'].setValue(this.maskMoney.transform(response.venture3));
      this.form.controls['ventureBuilder1'].setValue(this.maskMoney.transform(response.ventureBuilder1));
      this.form.controls['ventureBuilder2'].setValue(this.maskMoney.transform(response.ventureBuilder2));
      this.form.controls['ventureBuilder3'].setValue(this.maskMoney.transform(response.ventureBuilder3));
      this.form.controls['investmentFund1'].setValue(this.maskMoney.transform(response.investmentFund1));
      this.form.controls['investmentFund2'].setValue(this.maskMoney.transform(response.investmentFund2));

      const $this = this;
      setTimeout(function () {
        $this.initMask();
      }, 1000);

      this.loader = false;
    }, (error) => {

      const $this = this;
      setTimeout(function () {
        $this.initMask();
      }, 1000);

      this.loader = false;
    });
  }

  updateCaptable() {
    if (this.form.valid) {
      const dataSend = this.form.value;
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

      this.captableService.updateCaptable(this.company, dataSend).subscribe((response) => {
        toastr.success('Dados atualizados.');
        this.redirectTo('admin/rounds/company/captable/' + this.company);
      }, (error) => {
        toastr.error('Ocorreu um erro, contate o administrador.');
      });
    } else {
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

}
