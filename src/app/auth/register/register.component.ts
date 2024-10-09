import { LoaderService } from './../../core/service/loader.service';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../core/service/auth.service';
import { Router } from '@angular/router';

declare var $: any;
declare var toastr: any;
declare var bootbox: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  errorCredentials: boolean;
  form: FormGroup;
  loader: boolean;
  cpfValidator = 'O campo é obrigatório';
  emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  documentClass: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    this.initForm();
    const $this = this;
    setTimeout(function () {
      $this.initMask();
    }, 1000);
    $('body').addClass('hold-transition');
    $('body').addClass('login-page');
    $('html').addClass('backgroundLogin');
  }

  initForm() {
    this.form = this.formBuilder.group({
      nickname: [null, [Validators.required]],
      fullName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.pattern(this.emailPattern)]],
      document: [null, [Validators.required]],
      termosGerais: [null, [Validators.required]],
      typeDocument: [null, [Validators.required]]
    });
  }

  initMask() {
    $('.cpf').mask('000.000.000-00', { reverse: false });
    $('.cnpj').mask('00.000.000/0000-00', { reverse: true });
  }

  unmaskInput(input) {
    return input.replace(/[^\d]+/g, '');
  }

  validate() {
    const document = this.unmaskInput(this.form.controls['document'].value);
    if (document.length === 11 && this.form.controls['typeDocument'].value === 'cpf') {
      this.validateCpf(document);
    } else if (document.length === 14 && this.form.controls['typeDocument'].value === 'cnpj') {
      this.validateCnpj(document);
    } else {
      const tipoDocumento = this.form.controls['typeDocument'].value;
      toastr.error('Por favor insira o ' + tipoDocumento + '.');
      return false;
    }
  }

  validateCpf(cpf) {
    if (cpf === '' || cpf == null || cpf.length !== 11 || /(\d)\1{10}/.test(cpf)) {
      toastr.error('CPF inválido.');
      return false;
    }
    let sum = 0;
    let remainder;
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i), 10) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10), 10)) {
      toastr.error('CPF inválido.');
      return false;
    }
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i), 10) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11), 10)) {
      toastr.error('CPF inválido.');
      return false;
    }
    return true;
  }

  validateCnpj(cnpj) {
    if (cnpj === '' || cnpj == null || cnpj.length !== 14 || /(\d)\1{13}/.test(cnpj)) {
      toastr.error('CNPJ inválido.');
      return false;
    }
    let length = cnpj.length - 2;
    let numbers = cnpj.substring(0, length);
    let digits = cnpj.substring(length);
    let sum = 0;
    let pos = length - 7;
    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i), 10) * pos--;
      if (pos < 2) pos = 9;
    }
    let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(0), 10)) {
      toastr.error('CNPJ inválido.');
      return false;
    }
    length += 1;
    numbers = cnpj.substring(0, length);
    sum = 0;
    pos = length - 7;
    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i), 10) * pos--;
      if (pos < 2) pos = 9;
    }
    result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(1), 10)) {
      toastr.error('CNPJ inválido.');
      return false;
    }
    return true;
  }

  private validateFullName(fullName: string): boolean {
    return fullName.trim().split(' ').length >= 2;
  }

  onSubmit() {
    this.loader = true;
    this.loaderService.load(this.loader);

    const fullName = this.form.controls['fullName'].value;

    if (fullName === null || !this.validateFullName(fullName)) {
      toastr.error('O nome completo deve conter pelo menos dois nomes.');
      this.loader = false;
      this.loaderService.load(this.loader);
      return;
    }

    if (!this.form.value.termosGerais) {
      toastr.error('Você deve concordar com os termos de uso.');
      this.loader = false;
      this.loaderService.load(this.loader);
      return;
    }

    if (this.form.valid && this.form.value.typeDocument !== null) {
      const dataSend = this.form.value;
      dataSend.termosGerais = undefined;
      dataSend.typeDocument = undefined;
      dataSend.document = undefined;
      dataSend.email = this.form.controls['email'].value.toLowerCase();
      if (this.form.controls['typeDocument'].value === 'cpf') {
        dataSend.cpf = this.unmaskInput(this.form.controls['document'].value);
      }
      if (this.form.controls['typeDocument'].value === 'cnpj') {
        dataSend.cnpj = this.unmaskInput(this.form.controls['document'].value);
      }
      if (dataSend.nickname.length < 3) {
        this.loader = false;
        this.loaderService.load(this.loader);
        toastr.error('O campo Usuário deve ter no mínimo 3 caracteres.');
      } else if (dataSend.fullName.length < 6) {
        this.loader = false;
        this.loaderService.load(this.loader);
        toastr.error('O campo Nome Completo deve ter no mínimo 6 caracteres.');
      } else {
        this.authService.register(dataSend).subscribe(
          (response) => {
            this.loader = false;
            this.loaderService.load(this.loader);
            bootbox.dialog({
              title: 'Aviso',
              message: 'Seu cadastro foi realizado. Enviamos ao seu e-mail uma senha temporária.',
              buttons: {
                ok: {
                  label: 'Fechar',
                  className: 'bg-upangel',
                  callback: function () { }
                }
              }
            });
            this.router.navigate(['/auth/login']);
          }, (error) => {
            if (error.error.code === 'DUPLICATE_NICKNAME') {
              toastr.error('Este usuário já foi utilizado.');
            }
            if (error.error.code === 'EMAIL_ALREADY_EXISTS') {
              toastr.error('Este e-mail já foi utilizado.');
            }
            if (error.error.code === 'DUPLICATE_CPF_CNPJ') {
              toastr.error('CPF já existente.');
            }
            if (error.error.code === 'Size') {
              toastr.error('O campo Usuário deve ter no mínimo 3 caracteres.');
            }
            if (error.error.errors) {
              toastr.error(error.error.errors[0].defaultMessage);
            }
            const $this = this;
            setTimeout(function () {
              $this.initMask();
            }, 500);
            this.loader = false;
            this.loaderService.load(this.loader);
          }
        );

      }
    } else {
      this.loader = false;
      this.loaderService.load(this.loader);
      toastr.error('Todos os campos devem ser preenchidos.');
    }
  }

  selectType(type: string): void {
    if (this.form.value.typeDocument === type) {
      this.form.patchValue({ typeDocument: null });
    } else {
      this.form.patchValue({ typeDocument: type });
    }
    this.changeDocument(type);
  }

  changeDocument(input) {
    this.form.controls['document'].setValue('');
    this.documentClass = input;
    const $this = this;
    if (input !== null && input !== '') {
      setTimeout(function () {
        $this.initMask();
      }, 500);
    }
  }
}