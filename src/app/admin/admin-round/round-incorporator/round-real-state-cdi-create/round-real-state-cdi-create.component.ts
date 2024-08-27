import { MoneyMaskPipe } from './../../../../core/pipes/money-mask.pipe';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Valuation } from '../../../../core/interface/valuation';
import { CompanyService } from '../../../../core/service/company.service';

declare var $: any;
declare var moment: any;
declare var toastr: any;

@Component({
  selector: 'app-round-real-state-cdi-create',
  templateUrl: './round-real-state-cdi-create.component.html',
  styleUrls: ['./round-real-state-cdi-create.component.css']
})
export class RoundRealStateCdiCreateComponent implements OnInit {

  form: FormGroup;
  loader: boolean;
  valuation: Valuation;
  company = 0;

  constructor(
    private activedRouter: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private valuationService: CompanyService,
    private maskMoney: MoneyMaskPipe
  ) { }

  ngOnInit() {

    this.activedRouter.params.subscribe(params => {
      this.company = params['id'];
    });

    this.initForm();
    // this.getValuation();
    this.initMask();
  }

  initForm() {
    this.form = this.formBuilder.group({
      current: ['0,00', [Validators.required, Validators.minLength(3)]],
      shortTerm: ['0,00', [Validators.required, Validators.minLength(3)]],
      longTerm: ['0,00', [Validators.required, Validators.minLength(3)]]
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
    // if (this.form.valid) {
    //   const dataSend = this.form.value;
    //   dataSend.date = moment(new Date()).format('DD/MM/YYYY hh:mm:ss');
    //   dataSend.current = this.unmaskMoney(dataSend.current);
    //   dataSend.shortTerm = this.unmaskMoney(dataSend.shortTerm);
    //   dataSend.longTerm = this.unmaskMoney(dataSend.longTerm);

    //   this.valuationService.createValuation(this.company, dataSend).subscribe((response) => {
    //     toastr.success('Dados atualizados.');
    //     this.getValuation();
    //   }, (error) => {
    //     toastr.error('Ocorreu um erro, contate o administrador.');
    //   });
    // } else {
    //   this.validateAllFields(this.form);
    //   toastr.error('Formulário preenchido incorretamente. Por favor revise seus dados.');
    // }

    toastr.success('Em desenvolvimento.');
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

  // getValuation() {
  //   this.loader = true;
  //   this.valuationService.getValuation(this.company).subscribe((response) => {
  //     this.valuation = response;

  //     this.form.controls['current'].setValue(this.maskMoney.transform(response.current));
  //     this.form.controls['shortTerm'].setValue(this.maskMoney.transform(response.shortTerm));
  //     this.form.controls['longTerm'].setValue(this.maskMoney.transform(response.longTerm));
  //     this.initMask();

  //     this.loader = false;
  //   });
  // }

}
