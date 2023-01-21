import { ShareModule } from './../share/share.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing/auth-routing.module';
import { MFAComponent } from './mfa/mfa.component';
import { LoginComponent } from './login/login.component';
import { ForgotComponent } from './forgot/forgot.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AuthRoutingModule,
    ShareModule,
  ],
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    MFAComponent,
    ForgotComponent
  ],
  exports: [
    AuthComponent
  ]
})
export class AuthModule { }
