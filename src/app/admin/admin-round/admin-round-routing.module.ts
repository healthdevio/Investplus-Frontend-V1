import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoundCompanyIndicatorsComponent } from './round-company-indicators/round-company-indicators.component';
import { RoundAssetsListComponent } from './round-assets-list/round-assets-list.component';
import { RoundFinishComponent } from './round-finish/round-finish.component';
import { RoundTokenComponent } from './round-token/round-token.component';

const routes: Routes = [
    
    { path: "", redirectTo: "assets/list", pathMatch: "full" },
    {
        path: "finish",
        component: RoundFinishComponent,
        data: { scopes: ["ROLE_INVESTOR"] },
    },
    {
        path: "indicators/company/:id/round/:id2",
        component: RoundCompanyIndicatorsComponent,
        data: { scopes: ["ROLE_INVESTOR"] },
    },
    {
        path: "assets/list",
        component: RoundAssetsListComponent,
        data: { scopes: ["ROLE_INVESTOR"] },
    },
    {
        path: 'investment',
        loadChildren: () => import('./round-investment/round-investment.module').then((m) => m.AdminRoundInvestmentModule),
    },
    {
        path: 'company',
        loadChildren: () => import('./round-company/round-company.module').then((m) => m.AdminRoundCompanyModule),
    },
    {
        path: 'approval',
        loadChildren: () => import('./round-approval/round-approval.module').then((m) => m.AdminRoundApprovalModule),
    },
    {
        path: 'incorporator',
        loadChildren: () => import('./round-incorporator/round-incorporator.module').then((m) => m.AdminRoundIncorporatorModule),
    },
    {
        path: ':roundType',
        loadChildren: () => import('./round-comments/round-comments.module').then((m) => m.AdminRoundCommentsModule),
    },
    {
        path: "token",
        component: RoundTokenComponent,
        data: { scopes: ["ROLE_INVESTOR"] },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoundRoutingModule { }
