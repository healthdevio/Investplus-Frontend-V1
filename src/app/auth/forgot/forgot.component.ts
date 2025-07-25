import { Component, ChangeDetectorRef } from '@angular/core';
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
      private passwordStrengthService: PasswordStrengthService,
      private cdRef: ChangeDetectorRef
  ) {
    this.statusForgot = true;
  }

  onNext() {
    this.loader = true;
    this.loaderService.load(this.loader);
    if (this.email == null || this.email.length < 8) {
      toastr.error('O e-mail precisa ser preenchido');
      this.loader = false;
      this.loaderService.load(this.loader);
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

  private showVerificationScreen(message: string) {
    this.statusForgot = false;
    toastr.info(message);
    this.cdRef.detectChanges(); // Força a atualização da tela
  }

  cognitoCallback(message: string, result: any) {
    this.loader = false;
    this.loaderService.load(this.loader);

    if (message == null && result == null) {
      if (this.statusForgot === true) {
        this.showVerificationScreen('Enviamos um código de verificação para o seu e-mail.');
      }
      else {
        this.router.navigate(['/auth/login']);
        toastr.success('Nova senha alterada com sucesso!');
      }
    } else {
      this.handleError(message);
    }
  }

  resendConfirmationCallback(message: string, result: any) {
    this.loader = false;
    this.loaderService.load(this.loader);
    if (message == null && result == null) {
      bootbox.dialog({
        title: 'Verifique seu E-mail',
        message: `Seu e-mail ainda não foi validado. <strong>Enviamos um novo e-mail de confirmação para sua caixa de entrada.</strong><br/><br/>Por favor, clique no link de validação e tente recuperar sua senha novamente.`,
        buttons: {
          ok: {
            label: 'Entendido',
            className: 'bg-upangel',
            callback: () => {
              this.router.navigate(['/auth/login']);
            }
          }
        }
      });
    } else {
      toastr.error('Não foi possível reenviar o e-mail de confirmação. Tente novamente mais tarde.');
    }
    this.cdRef.detectChanges();
  }

  private resendWelcomeEmail() {
    this.loader = true;
    this.loaderService.load(this.loader);

    this.userService.resendTemporaryPasswordEmail(this.email).subscribe({
      next: (response) => {
        this.loader = false;
        this.loaderService.load(this.loader);

        this.showVerificationScreen(response.message || 'Um novo e-mail de boas-vindas foi enviado.');
      },
      error: (err) => {
        this.loader = false;
        this.loaderService.load(this.loader);
        toastr.error(err.error?.message || 'Ocorreu um erro ao reenviar o e-mail de boas-vindas.');
        this.cdRef.detectChanges();
      }
    });
  }

  handleError(message: string) {
    const lowerCaseMessage = message.toLowerCase();

    if (lowerCaseMessage.includes('user password cannot be reset in the current state')) {
      this.resendWelcomeEmail();
      return;
    }

    const isUserNotConfirmedError = lowerCaseMessage.includes('user is not confirmed') ||
        lowerCaseMessage.includes('no registered/verified');

    if (isUserNotConfirmedError) {
      this.loader = true;
      this.loaderService.load(this.loader);
      this.userService.resendConfirmationCode(this.email, this);
      return;
    }

    this.loader = false;
    this.loaderService.load(this.loader);
    if (lowerCaseMessage.includes('user not found')) {
      toastr.error('Usuário não encontrado.');
    } else if (message.includes('Password')) {
      toastr.error(message);
    } else {
      toastr.error('Sua solicitação não pode ser completada. Tente novamente mais tarde.');
      this.errorMessage = message;
    }
    this.cdRef.detectChanges();
  }
}