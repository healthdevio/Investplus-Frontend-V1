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
      this.form.controls['document'].setValue('');
      toastr.error('Por favor insira o ' + tipoDocumento + '.');
      return false;
    }
  }

  validateCpf(cpf) {
      if (cpf === '') {
        this.form.controls['document'].setValue('');
        toastr.error('Por favor insira seu CPF.');
        return false;
      }
      if (cpf == null) {
        this.form.controls['document'].setValue('');
        toastr.error('CPF inválido.');
        return false;
      }
      if (cpf.length !== 11) {
        this.form.controls['document'].setValue('');
        toastr.error('CPF inválido.');
        return false;
      }
      if ((cpf === '00000000000') || (cpf === '11111111111') || (cpf === '22222222222') || (cpf === '33333333333') || (cpf === '44444444444') || (cpf === '55555555555') || (cpf === '66666666666') || (cpf === '77777777777') || (cpf === '88888888888') || (cpf === '99999999999')) {
        this.form.controls['document'].setValue('');
        toastr.error('CPF inválido.');
        return false;
      }
      let numero = 0;
      let caracter = '';
      const numeros = '0123456789';
      let j = 10;
      let somatorio = 0;
      let resto = 0;
      let digito1 = 0;
      let digito2 = 0;
      let cpfAux = '';
      cpfAux = cpf.substring(0, 9);
      for (let i = 0; i < 9; i++) {
        caracter = cpfAux.charAt(i);
        if (numeros.search(caracter) === -1) {
          this.form.controls['document'].setValue('');
          toastr.error('CPF inválido.');
          return false;
        }
        numero = Number(caracter);
        somatorio = somatorio + (numero * j);
        j--;
      }
      resto = somatorio % 11;
      digito1 = 11 - resto;
      if (digito1 > 9) {
        digito1 = 0;
      }
      j = 11;
      somatorio = 0;
      cpfAux = cpfAux + digito1;
      for (let i = 0; i < 10; i++) {
        caracter = cpfAux.charAt(i);
        numero = Number(caracter);
        somatorio = somatorio + (numero * j);
        j--;
      }
      resto = somatorio % 11;
      digito2 = 11 - resto;
      if (digito2 > 9) {
        digito2 = 0;
      }
      cpfAux = cpfAux + digito2;
      if (cpf !== cpfAux) {
        this.form.controls['document'].setValue('');
        toastr.error('CPF inválido.');
        return false;
      } else {
        return true;
      }
  }

  is_cnpj(cnpj) {
    if (cnpj === '') {
      this.form.controls['document'].setValue('');
      toastr.error('Por favor insira seu CNPJ.');
      return false;
    }
    if (cnpj === null) {
      this.form.controls['document'].setValue('');
      toastr.error('CNPJ inválido.');
      return false;
    }
    if (cnpj.length !== 14) {
      this.form.controls['document'].setValue('');
      toastr.error('CNPJ inválido.');
      return false;
    }
    if (cnpj === '00000000000000' || cnpj === '11111111111111' || cnpj === '22222222222222' || cnpj === '33333333333333' || cnpj === '44444444444444' || cnpj === '55555555555555' || cnpj === '66666666666666' || cnpj === '77777777777777' || cnpj === '88888888888888' || cnpj === '99999999999999') {
      this.form.controls['document'].setValue('');
      toastr.error('CNPJ inválido.');
      return false;
    }
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== digitos.charAt(0)) {
      this.form.controls['document'].setValue('');
      toastr.error('CNPJ inválido.');
      return false;
    }
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== digitos.charAt(1)) {
      this.form.controls['document'].setValue('');
      toastr.error('CNPJ inválido.');
      return false;
    }
    return true;
  }

  validateCnpj(c) {
      var b = [6,5,4,3,2,9,8,7,6,5,4,3,2];
      if((c = c.replace(/[^\d]/g,"")).length != 14) {
        toastr.error('CNPJ inválido.');
        this.form.controls['document'].setValue('');
        return false;
      }
      if(/0{14}/.test(c)) {
        toastr.error('CNPJ inválido.');
        this.form.controls['document'].setValue('');
        return false;
      }
      for (var i = 0, n = 0; i < 12; n += c[i] * b[++i]);
        if(c[12] != (((n %= 11) < 2) ? 0 : 11 - n)) {
          toastr.error('CNPJ inválido.');
          this.form.controls['document'].setValue('');
          return false;
        }
      for (var i = 0, n = 0; i <= 12; n += c[i] * b[i++]);
      if(c[13] != (((n %= 11) < 2) ? 0 : 11 - n)) {
        toastr.error('CNPJ inválido.');
        this.form.controls['document'].setValue('');
        return false;
      }
      return true;
  };

  onSubmit() {
    this.loader = true;
    this.loaderService.load(this.loader);
    if (this.form.valid && this.form.value.termosGerais === true && this.form.value.typeDocument !== null) {
      // const aux = this.form.value.typeDocument;
      // dataSend.cpf = this.unmaskInput(this.form.controls['document'].value);
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
                  callback: function () {}
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
