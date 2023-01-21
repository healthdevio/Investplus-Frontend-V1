import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoundApprovalCreateComponent } from './round-approval-create/round-approval-create.component';
import { RoundApprovalDetailsComponent } from './round-approval-details/round-approval-details.component';
import { RoundApprovalDocsDetailsComponent } from './round-approval-docs-details/round-approval-docs-details.component';
import { RoundApprovalDocsComponent } from './round-approval-docs/round-approval-docs.component';
import { RoundApprovalListComponent } from './round-approval-list/round-approval-list.component';
import { RoundCompanyApprovalComponent } from './round-company-approval/round-company-approval.component';
import { RoundInvestmentDetailsComponent } from '../components/round-investment-details/round-investment-details.component';
import { RoundRealStatePublishComponent } from './round-real-state-publish/round-real-state-publish.component';
import { RoundCompanyPublishComponent } from './round-company-publish/round-company-publish.component';

const routes: Routes = [
    {
        path: "", pathMatch: "full",
        component: RoundApprovalListComponent,
        data: { scopes: ["ROLE_ADMIN"] },
    },
    {
        path: "create",
        component: RoundApprovalCreateComponent,
        data: { scopes: ["ROLE_ADMIN"] },
    },
    {
        path: "companies/docs",
        component: RoundApprovalDocsComponent,
        data: { scopes: ["ROLE_ADMIN"] },
    },
    {
        path: "company/final",
        component: RoundCompanyApprovalComponent,
        data: { scopes: ["ROLE_ADMIN"] },
    },
    {
        path: "company/publish",
        component: RoundCompanyPublishComponent,
        data: { scopes: ["ROLE_ADMIN"] },
    },
    {
        path: "company/:id/docs",
        component: RoundApprovalDocsDetailsComponent,
        data: { scopes: ["ROLE_ADMIN"] },
    },
    {
        path: "company/:id/details",
        component: RoundInvestmentDetailsComponent,
        data: { scopes: ["ROLE_ADMIN"] },
    },
    {
        path: "company/:id/complete",
        component: RoundInvestmentDetailsComponent,
        data: { scopes: ["ROLE_ADMIN"] },
    },
    {
        path: ":id/details",
        component: RoundApprovalDetailsComponent,
        data: { scopes: ["ROLE_ADMIN"] },
    },
    {
        path: "incorporator/publish",
        component: RoundRealStatePublishComponent,
        data: { scopes: ["ROLE_ADMIN"] },
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoundApprovalRoutingModule { }
