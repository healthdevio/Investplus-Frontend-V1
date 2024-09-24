import { Component } from '@angular/core';
import { CognitoCallback } from '../../core/service/cognito/cognito.service';
import { Router } from '@angular/router';
import { UserLoginService } from '../../core/service/cognito/user-login.service';
import { EventEmitterService } from '../../core/service/event-emitter-service.service';
import { LoaderService } from './../../core/service/loader.service';
import { PasswordStrengthService } from './../../core/service/PasswordStrengthService.service';

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

  senhaStrength: string = ''; 
  senhaScore: number = 0;
  senhaSuggestions: string[] = [];

  constructor(
    public router: Router,
    public userService: UserLoginService,
    private eventEmitter: EventEmitterService,
    private loaderService: LoaderService,
    private passwordStrengthService: PasswordStrengthService  
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

  onPasswordInput() {
    if (this.password) {
      const result = this.passwordStrengthService.calculateStrength(this.password);
      this.senhaStrength = result.level;
      this.senhaScore = result.score;
      this.senhaSuggestions = result.suggestions;
    } else {
      this.senhaStrength = '';
      this.senhaScore = 0;
      this.senhaSuggestions = [];
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
      this.handleError(message);
    }
  }

  handleError(message: string) {
    if (message === 'Username/client id combination not found.') {
      toastr.error('E-mail inválido');
    } else if (message.includes('Password')) {
      toastr.error(message);  
    } else {
      toastr.error('Sua solicitação não pode ser completada. Tente novamente mais tarde.');
      this.errorMessage = message;
    }
  }
}
