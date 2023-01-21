import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
import { RoundInvestmentDetailsComponent } from '../components/round-investment-details/round-investment-details.component';
import { RoundInvestmentInstallmentsDetailsComponent } from './round-investment-installments-details/round-investment-installments-details.component';
import { RoundInvestmentInstallmentsComponent } from './round-investment-installments/round-investment-installments.component';
import { RoundInvestmentsDetailsComponent } from './round-investments-details/round-investments-details.component';
import { RoundInvestmentsComponent } from './round-investments/round-investments.component';
import { RoundCompanyPartnersComponent } from './round-company-partners/round-company-partners.component';
import { RoundCompanyPartnersCreateComponent } from './round-company-partners-create/round-company-partners-create.component';
import { RoundCompanyDocsComponent } from './round-company-docs/round-company-docs.component';

const routes: Routes = [
    { path: "", redirectTo: "valuation", pathMatch: "full" },
    {
        path: ":id/create",
        component: RoundCompanyDetailsComponent,
        data: { scopes: ["ROLE_ADMIN"] },
    },
    {
      path: ":id/update/:idRound",
      component: RoundCompanyDetailsComponent,
      data: { scopes: ["ROLE_ADMIN"] },
    },
    {
        path: "valuation",
        component: RoundCompanyValuationComponent,
        data: { scopes: ["ROLE_ADMIN"] },
    },
    {
        path: "captable",
        component: RoundCompanyCaptableComponent,
        data: { scopes: ["ROLE_ADMIN"] },
    },
    {
        path: "captable/:id",
        component: RoundCompanyCaptableCreateComponent,
        data: { scopes: ["ROLE_ADMIN"] },
    },
    {
      path: "partners",
      component: RoundCompanyPartnersComponent,
      data: { scopes: ["ROLE_ADMIN"] },
    },
    {
      path: "partners/:id",
      component: RoundCompanyPartnersCreateComponent,
      data: { scopes: ["ROLE_ADMIN"] },
    },
    {
        path: "financial",
        component: RoundCompanyFinancialComponent,
        data: { scopes: ["ROLE_ADMIN"] },
    },
    {
        path: "financial/:id",
        component: RoundCompanyFinancialCreateComponent,
        data: { scopes: ["ROLE_ADMIN"] },
    },
    {
        path: "valuation/:id",
        component: RoundCompanyValuationCreateComponent,
        data: { scopes: ["ROLE_ADMIN"] },
    },
    {
        path: "docs",
        component: RoundCompanyDocsComponent,
        data: { scopes: ["ROLE_ADMIN"] },
    },
    {
        path: "team",
        component: RoundCompanyTeamComponent,
        data: { scopes: ["ROLE_ADMIN"] },
    },
    {
        path: "team/:id",
        component: RoundCompanyTeamCreateComponent,
        data: { scopes: ["ROLE_ADMIN"] },
    },
    {
        path: "admin",
        component: RoundCompanyAdminComponent,
        data: { scopes: ["ROLE_ADMIN"] },
    },
    {
        path: "admin/:id",
        component: RoundCompanyAdminCreateComponent,
        data: { scopes: ["ROLE_ADMIN"] },
    },
    {
        path: "investments",
        component: RoundInvestmentsComponent,
        data: { scopes: ["ROLE_ADMIN"] },
    },
    {
        path: "investments/:id",
        component: RoundInvestmentsDetailsComponent,
        data: { scopes: ["ROLE_ADMIN"] },
    },
    {
        path: "investments/installment/:id",
        component: RoundInvestmentInstallmentsComponent,
        data: { scopes: ["ROLE_ADMIN"] },
    },
    {
        path: "investments/installments/:id",
        component: RoundInvestmentInstallmentsDetailsComponent,
        data: { scopes: ["ROLE_ADMIN"] },
    },
    {
        path: ":id/round/:id2",
        component: RoundInvestmentDetailsComponent,
        data: { scopes: ["ROLE_INVESTOR"] },
    },
    {
        path: ":id/round/:id2/forum",
        component: RoundForumPostsComponent,
        data: { scopes: ["ROLE_INVESTOR"] },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoundCompanyRoutingModule { }
