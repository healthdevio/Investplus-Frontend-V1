import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompanyComponent } from '../company.component';
import { InvestorsComponent } from '../investors/investors.component';
import { InvestorsListComponent } from '../investors/investors-list/investors-list.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '', component: CompanyComponent, children: [
          { path: '', redirectTo: 'investors', pathMatch: 'full' },
          { path: 'investors', component: InvestorsComponent, data: { scopes: ['ROLE_COMPANY'] }, children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            { path: 'list', component: InvestorsListComponent, data: { scopes: ['ROLE_COMPANY'] } },
          ]},
          { path: 'dashboard', component: DashboardComponent, data: { scopes: ['ROLE_COMPANY'] } }
        ]
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class CompanyRountingModule { }
