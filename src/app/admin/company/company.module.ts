import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyComponent } from './company.component';
import { InvestorsComponent } from './investors/investors.component';
import { CompanyRountingModule } from './company-rounting/company-rounting.module';
import { InvestorsListComponent } from './investors/investors-list/investors-list.component';
import { ShareModule } from '../../share/share.module';
import { UtilsModule } from './utils/utils.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    ShareModule,
    CompanyRountingModule,
    UtilsModule,
    NgxPaginationModule
  ],
  declarations: [
    CompanyComponent,
    InvestorsComponent,
    InvestorsListComponent,
    DashboardComponent
  ],
  exports: [
    CompanyComponent
  ]
})
export class CompanyModule { }
