import { RegisterComponent } from '../auth/register/register.component';
import { AdminComponent } from '../admin/admin.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
import { AuthComponent } from '../auth/auth.component';
import { AuthGuard } from '../guards/auth.guard';
// import { LoggedInGuard } from '../guards/loggedin.guard';

@NgModule({
  imports: [
  RouterModule.forRoot([
    // { path: '', component: AdminComponent },
    { path: '', redirectTo: 'auth', pathMatch: 'full' },
    { path: 'auth', loadChildren: () => import('./../auth/auth.module').then(m => m.AuthModule) },
    { path: 'admin', loadChildren: () => import('./../admin/admin.module').then(m => m.AdminModule) },
    // { path: 'admin', loadChildren: './../admin/admin.module#AdminModule', canLoad: [AuthGuard], canActivate: [AuthGuard], canActivateChild: [AuthGuard], data: { scopes: ['ROLE_INVESTOR', 'ROLE_ADMIN'] } },
    // { path: 'admin', component: AdminComponent },
    {path: '**', redirectTo: 'auth'}
], { relativeLinkResolution: 'legacy' })
  ],
  declarations: [],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
