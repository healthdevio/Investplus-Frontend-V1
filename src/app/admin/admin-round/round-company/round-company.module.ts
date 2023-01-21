import { AdminRoundComponentsModule } from './../components/components.module';
import { AdminRoundCompanyRoutingModule } from './round-company-routing.module';
import { ShareModule } from './../../../share/share.module';
import { PipesModule } from './../../../core/pipes/pipes.module';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { Ng5SliderModule } from 'ng5-slider';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { RoundCompanyAdminCreateComponent } from './round-company-admin-create/round-company-admin-create.component';
import { RoundCompanyAdminComponent } from './round-company-admin/round-company-admin.component';
import { RoundCompanyCaptableCreateComponent } from './round-company-captable-create/round-company-captable-create.component';
import { RoundCompanyCaptableComponent } from './round-company-captable/round-company-captable.component';
import { RoundCompanyDetailsComponent } from './round-company-details/round-company-details.component';
import { RoundCompanyFinancialCreateComponent } from './round-company-financial-create/round-company-financial-create.component';
import { RoundCompanyFinancialComponent } from './round-company-financial/round-company-financial.component';
import { RoundCompanyTeamCreateComponent } from './round-company-team-create/round-company-team-create.component';
import { RoundCompanyTeamComponent } from './round-company-team/round-company-team.component';
import { RoundCompanyValuationCreateComponent } from './round-company-valuation-create/round-company-valuation-create.component';
import { RoundCompanyValuationComponent } from './round-company-valuation/round-company-valuation.component';
import { RoundForumPostsComponent } from './round-forum-posts/round-forum-posts.component';
import { RoundInvestmentInstallmentsDetailsComponent } from './round-investment-installments-details/round-investment-installments-details.component';
import { RoundInvestmentInstallmentsComponent } from './round-investment-installments/round-investment-installments.component';
import { RoundInvestmentsDetailsComponent } from './round-investments-details/round-investments-details.component';
import { RoundInvestmentsComponent } from './round-investments/round-investments.component';
import { RoundCompanyPartnersComponent } from './round-company-partners/round-company-partners.component';
import { RoundCompanyPartnersCreateComponent } from './round-company-partners-create/round-company-partners-create.component';
import { RoundCompanyDocsComponent } from './round-company-docs/round-company-docs.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  imports: [
    PipesModule,
    CommonModule,
    ShareModule,
    Ng5SliderModule,
    HttpClientModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    AdminRoundCompanyRoutingModule,
    AdminRoundComponentsModule,
    TooltipModule.forRoot()
  ],
  declarations: [
    RoundCompanyAdminCreateComponent,
    RoundCompanyAdminComponent,
    RoundCompanyCaptableCreateComponent,
    RoundCompanyCaptableComponent,
    RoundCompanyDetailsComponent,
    RoundCompanyFinancialCreateComponent,
    RoundCompanyFinancialComponent,
    RoundCompanyTeamCreateComponent,
    RoundCompanyTeamComponent,
    RoundCompanyValuationCreateComponent,
    RoundCompanyValuationComponent,
    RoundForumPostsComponent,
    RoundInvestmentInstallmentsDetailsComponent,
    RoundInvestmentInstallmentsComponent,
    RoundInvestmentsDetailsComponent,
    RoundInvestmentsComponent,
    RoundCompanyPartnersComponent,
    RoundCompanyPartnersCreateComponent,
    RoundCompanyDocsComponent
  ],
})
export class AdminRoundCompanyModule { }
