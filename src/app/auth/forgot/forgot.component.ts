import { LoaderService } from './../../core/service/loader.service';
import { Component } from '@angular/core';
import { CognitoCallback } from '../../core/service/cognito/cognito.service';
import { Router } from '@angular/router';
import { UserLoginService } from '../../core/service/cognito/user-login.service';
import { EventEmitterService } from '../../core/service/event-emitter-service.service';

declare var toastr: any;
declare var bootbox: any;

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements CognitoCallback {

  email: string;
  errorMessage: string;
  verificationCode: string;
  password: string;
  confirmPassword: string;
  statusForgot: boolean;
  loader: boolean = false;

  constructor(
    public router: Router,
    public userService: UserLoginService,
    private eventEmitter: EventEmitterService,
    private loaderService: LoaderService
  ) {
    this.statusForgot = true;
  }

  onNext() {
    if (this.email == null || this.email.length < 8) {
      toastr.error('O e-mail precisa ser preenchido');
      return;
    }
    this.userService.forgotPassword(this.email, this);
  }

  onSubmit() {
    this.loader = true;
    this.loaderService.load(this.loader);
    if (this.confirmPassword && this.confirmPassword === this.password) {
      this.userService.confirmNewPassword(this.email, this.verificationCode.trim(), this.password, this);
    } else {
      toastr.error('Confirmação de senha não está correto');
      this.loader = false;
      this.loaderService.load(this.loader);
      return;
    }
  }

  cognitoCallback(message: string, result: any) {
    this.loader = false;
    this.loaderService.load(this.loader);
    if (message == null && result == null) {
      if (this.statusForgot === false) {
        this.router.navigate(['/auth/login']);
        toastr.success('Nova senha gerada com sucesso!');
      } else {
        this.statusForgot = false;
        bootbox.dialog({
          title: 'Aviso',
          message: 'Um codigo de alteração de senha foi enviada por e-mail.',
          buttons: {
            ok: {
              label: 'Fechar',
              className: 'bg-upangel',
              callback: function () { }
            }
          }
        });
      }
    } else {
      if (message === 'Username/client id combination not found.') {
        toastr.error('E-mail inválido');
      } else if (message === 'Password does not conform to policy: Password must have uppercase characters') {
        toastr.error('A senha deve conter caracteres maiúsculos');
      } else if (message === 'Password does not conform to policy: Password must have numeric characters') {
        toastr.error('A senha deve conter caracteres numericos');
      } else if (message === '1 validation error detected: Value at \'password\' failed to satisfy constraint: Member must have length greater than or equal to 6') {
        toastr.error('A senha deve conter no mínimo 6 caracteres');
        // tslint:disable-next-line:curly
      } else if (message === '2 validation errors detected: Value at \'password\' failed to satisfy constraint: Member must have length greater than or equal to 6; Value at \'password\' failed to satisfy constraint: Member must satisfy regular expression pattern: ^[\\S]+.*[\\S]+$') {
        toastr.error('A senha deve conter ao menos uma letra maiscula e um caracter numérico.');
      } else if (message === 'Password does not conform to policy: Password not long enough') {
        toastr.error('A senha deve conter no mínimo 6 caracteres');
      } else if (message === 'Attempt limit exceeded, please try after some time.') {
        toastr.error('O limite de tentativas foi excedido. Tente daqui 30 minutos.');
      } else if (message === 'User password cannot be reset in the current state.') {
        toastr.error('Não se pode mudar de senha sem antes fazer o login pela primeira vez na plataforma. Favor fazer o login com o código que enviamos de cadastro, o mesmo foi enviado via e-mail.');
      } else {
        toastr.error('Sua solicitação não pode ser completada. Tente novamente mais tarde.');
        this.errorMessage = message;
      }
    }
  }
}

