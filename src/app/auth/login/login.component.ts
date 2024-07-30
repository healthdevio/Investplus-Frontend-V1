import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLoginService } from '../../core/service/cognito/user-login.service';
import { ChallengeParameters, CognitoCallback, LoggedInCallback } from '../../core/service/cognito/cognito.service';
import { UserRegistrationService } from '../../core/service/cognito/user-registration.service';
import { InvestorService } from '../../core/service/investor.service';
import { LoaderService } from './../../core/service/loader.service';

declare var toastr: any;

export class NewPasswordUser {
  username: string;
  existingPassword: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements CognitoCallback, LoggedInCallback, OnInit {
  registrationUser: NewPasswordUser;
  router: Router;
  errorMessage: any;
  email: string;
  password: string;
  messageReturn: string;
  emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  mfaStep = false;
  emailValidator = false;
  emailError = 'O campo de e-mail é obrigatório';
  mfaData = {
    destination: '',
    callback: null
  };
  textLogin = 'Entre para iniciar sua sessão';
  statusError: boolean;
  loading: boolean;
  login: boolean;
  newPassword: boolean;
  alert: boolean;
  passwordFieldType: string = 'password';

  constructor(
    router: Router,
    public userService: UserLoginService,
    public userRegistration: UserRegistrationService,
    private investorService: InvestorService,
    private loadService: LoaderService
  ) {
    this.router = router;
  }

  ngOnInit() {
    this.userService.isAuthenticated(this);
    this.login = true;
    this.newPassword = false;
    this.errorMessage = null;
    this.alert = false;
  }

  onLogin() {
    if (this.email == null || this.password == null) {
      toastr.error('Todos os campos são obrigatórios');
      return;
    }

    this.errorMessage = null;
    this.loading = true;
    this.loadService.load(this.loading);
    this.userService.authenticate(this.email.toLowerCase(), this.password.trim(), this);
  }

  cognitoCallback(message: string, result: any) {
    const $this = this;
    this.loading = false;
    this.loadService.load(this.loading);
    if (message != null) {
      this.errorMessage = message;
      if (this.errorMessage === 'User does not exist.') {
        toastr.error('Usuário ou senha inválido');
        return;
      }
      if (this.errorMessage === 'User is not confirmed.') {
        toastr.error('O usuário não está confirmado');
        return;
      }
      if (this.errorMessage === 'Incorrect username or password.') {
        toastr.error('Usuário ou senha inválido');
        return;
      }
      if (this.errorMessage === 'User needs to set password.') {
        this.login = false;
        this.statusError = false;
        this.registrationUser = new NewPasswordUser();
        this.errorMessage = null;
        this.registrationUser.username = result.email;
        this.registrationUser.existingPassword = this.password.trim();
        return;
      }
      if (this.errorMessage.message === 'Password does not conform to policy: Password must have uppercase characters') {
        toastr.error('A senha deve conter pelo menos um caracter maiúsculo');
        return;
      } else if (this.errorMessage.message === 'Password does not conform to policy: Password must have numeric characters') {
        toastr.error('A senha deve conter pelo menos um caracter numérico');
        return;
      } else if (this.errorMessage.message === 'Password does not conform to policy: Password not long enough') {
        toastr.error('A senha deve conter no mínimo 6 caracteres');
        return;
      } else if (message === '1 validation error detected: Value at \'password\' failed to satisfy constraint: Member must have length greater than or equal to 6') {
        toastr.error('A senha deve conter no mínimo 6 caracteres');
      } else if (message === '2 validation errors detected: Value at \'password\' failed to satisfy constraint: Member must have length greater than or equal to 6; Value at \'password\' failed to satisfy constraint: Member must satisfy regular expression pattern: ^[\\S]+.*[\\S]+$') {
        toastr.error('A senha deve conter ao menos uma letra maiscula e um caracter numérico.');
      } else {
        toastr.error('Sua solicitação não pode ser completada. Tente novamente mais tarde.');
        return;
      }
    } else {
      this.router.navigate(['/admin']);
      this.statusError = false;
    }
  }

  handleMFAStep(challengeName: string, challengeParameters: ChallengeParameters, callback: (confirmationCode: string) => any): void {
    this.mfaStep = true;
    this.mfaData.destination = challengeParameters.CODE_DELIVERY_DESTINATION;
    this.mfaData.callback = (code: string) => {
      if (code == null || code.length === 0) {
        this.errorMessage = 'Code is required';
        return;
      }
      this.errorMessage = null;
      callback(code);
    };
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.loading = false;
      this.loadService.load(this.loading);
      this.router.navigate(['/admin']);
    }
  }

  cancelMFA(): boolean {
    this.mfaStep = false;
    return false;
  }

  onRegister() {
    this.errorMessage = null;
    if (this.registrationUser.password == null || this.registrationUser.password === '') {
      toastr.error('A senha deve conter no mínimo 6 caracteres');
    } else {
      this.userRegistration.newPassword(this.registrationUser, this);
    }
  }

  registerUser() {
    this.router.navigate(['/auth/register']);
  }

  validateEmail() {
    if (this.email == null || this.email === '') {
      this.emailError = 'O campo de e-mail é obrigatório';
      this.emailValidator = true;
    } else if (!this.emailPattern.test(this.email)) {
      this.emailError = 'O e-mail informado é inválido';
      this.emailValidator = true;
    } else {
      this.emailValidator = false;
    }
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
