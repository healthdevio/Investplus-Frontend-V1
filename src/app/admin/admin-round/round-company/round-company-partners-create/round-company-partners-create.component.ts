import { LoaderService } from './../../../../core/service/loader.service';
import { MoneyMaskPipe } from './../../../../core/pipes/money-mask.pipe';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TitleService } from '../../../../core/service/title.service';
import { TitleHeader } from '../../../../core/interface/title-header';
import { CompanyPartner } from '../../../../core/interface/company-partners';
import { CompanyPartnersService } from '../../../../core/service/company-partners.service';
import { finalize } from 'rxjs/operators';
import { UserService } from '../../../../core/service/user.service';
import { RadioOption } from '../../../../share/radio/radio-option.model';

declare var $: any;
declare var moment: any;
declare var toastr: any;
declare var bootbox: any;

@Component({
  selector: 'app-round-company-partners-create',
  templateUrl: './round-company-partners-create.component.html',
  styleUrls: ['./round-company-partners-create.component.css']
})
export class RoundCompanyPartnersCreateComponent implements OnInit {

  titleHeader: TitleHeader;
  form: FormGroup;
  loader: boolean;
  partners: CompanyPartner[];
  company = 0;

  loading: boolean = false;

  maritalStatus: RadioOption[] = [
    {
      label: 'SOLTEIRO(A)',
      value: 'SOLTEIRO',
      span: ''
    },
    {
      label: 'CASADO(A)',
      value: 'CASADO',
      span: ''
    }
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private partnersService: CompanyPartnersService,
    private data: TitleService,
    private maskMoney: MoneyMaskPipe,
    private loaderService: LoaderService,
    private userService: UserService
  ) { }

  ngOnInit() {

    this.data.currentMessage.subscribe(titles => this.titleHeader = titles);
    this.titleHeader.title = 'Administração / Partners';
    this.data.changeTitle(this.titleHeader);

    this.loader = true;

    this.company = this.activatedRoute.snapshot.params?.id;

    this.initForm();
    this.getPartners();
    this.initMask();
  }

  initForm() {
    this.form = this.formBuilder.group({
      partners: this.formBuilder.array([])
    });
  }

  get partnersForm(){
    return this.form.get("partners") as FormArray;
  }

  addPartner(){
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

  removePartner(index: number, partnerId: number){

    if(!partnerId){
      this.partnersForm.removeAt(index);
      return;
    }

    this.partnersService
      .deletePartner(this.company, partnerId)
      .subscribe({
        next: (response) => {
          this.partnersForm.removeAt(index);
        },
        error: (error) => {
          console.log(error);
        }
      })
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
      const dataSend = this.partnersForm.value;
      /* dataSend.founders = this.unmaskMoney(dataSend.founders);
      dataSend.coFounders = this.unmaskMoney(dataSend.coFounders);
      dataSend.vesting = this.unmaskMoney(dataSend.vesting);
      dataSend.accelerator = this.unmaskMoney(dataSend.accelerator);
      dataSend.crowdfunding = this.unmaskMoney(dataSend.crowdfunding);
      dataSend.angel = this.unmaskMoney(dataSend.angel);
      dataSend.venture1 = this.unmaskMoney(dataSend.venture1);
      dataSend.venture2 = this.unmaskMoney(dataSend.venture2);
      dataSend.venture3 = this.unmaskMoney(dataSend.venture3);
      dataSend.investmentFund1 = this.unmaskMoney(dataSend.investmentFund1);
      dataSend.investmentFund2 = this.unmaskMoney(dataSend.investmentFund2); */

      this.loading = true;
      this.loaderService.load(this.loading);
      this.partnersService
        .createPartner(this.company, dataSend)
        .pipe(
          finalize(() => {
            this.loading = false;
            this.loaderService.load(this.loading);
          })
        )
        .subscribe({
          next: (response) => {
            toastr.success('Dados enviados.');
            this.redirectTo('admin/rounds/company/partners/' + this.company);
          },
          error: (error) => {
            toastr.error('Ocorreu um erro, contate o administrador.');
          }
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

  getPartners() {
    this.partnersService.getPartner(this.company).subscribe((response) => {
      this.partners = response;
      this.partners
        .map(item => this.addPartner());
      this.partnersForm.patchValue(response);
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

  updatepartners() {
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
      dataSend.investmentFund1 = this.unmaskMoney(dataSend.investmentFund1);
      dataSend.investmentFund2 = this.unmaskMoney(dataSend.investmentFund2);

      this.partnersService.updatePartner(this.company, dataSend).subscribe((response) => {
        toastr.success('Dados atualizados.');
        this.redirectTo('admin/rounds/company/partners/' + this.company);
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

  public getCep(cep: string, index: number): void {
    //const data = this.form.value;
    //let cep = data.address.zipCode;
    console.log('[index]', index);
    cep = cep?.replace('-', '');
    const validacep = /^[0-9]{8}$/;

    if (!cep) {
      return;
    }

    if (!validacep.test(cep)) {
      return;
    }

    this.userService
      .getAddressByZipCode(cep)
      .subscribe(
        (dados) => {

          if (('erro' in dados)) {
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
            return;
          }

          this.partnersForm
            .at(index)
            .get('address')
            .patchValue({
              city: dados.localidade,
              neighborhood: dados.bairro,
              street: dados.logradouro,
              uf: dados.uf
            });
    });

  }

  // public clearAddress(): void {
  //   this.form.get('street').setValue('');
  //   this.form.get('city').setValue('');
  //   this.form.get('uf').setValue('');
  //   this.form.get('neighborhood').setValue('');
  // }

}
