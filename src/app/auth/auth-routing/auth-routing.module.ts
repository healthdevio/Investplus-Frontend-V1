import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { AuthComponent } from '../auth.component';
import { RegisterComponent } from '../register/register.component';
import { ForgotComponent } from '../forgot/forgot.component';
import { AuthGuard } from '../../guards/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '', component: AuthComponent, children: [
          { path: '', redirectTo: 'login', pathMatch: 'full' },
          { path: 'login', component: LoginComponent },
          { path: 'register', component: RegisterComponent },
          { path: 'forgot', component: ForgotComponent }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
