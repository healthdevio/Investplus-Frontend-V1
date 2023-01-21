import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoundForumPostsRealstateComponent } from './round-forum-posts-realstate/round-forum-posts-realstate.component';
import { RoundInvestimentsRealStateDetailsComponent } from './round-investiments-real-state-details/round-investiments-real-state-details.component'
import { RoundInvestimentsRealStateComponent } from './round-investiments-real-state/round-investiments-real-state.component';
import { RoundInvestmentRealStateDetailsComponent } from './round-investment-real-state-details/round-investment-real-state-details.component';
import { RoundRealStateCdiCreateComponent } from './round-real-state-cdi-create/round-real-state-cdi-create.component';
import { RoundRealStateCdiComponent } from './round-real-state-cdi/round-real-state-cdi.component';
import { RoundRealStateDetailsComponent } from './round-real-state-details/round-real-state-details.component';

const routes: Routes = [
    { path: "", redirectTo: "investments", pathMatch: "full" },
    {
        path: "round/:roundId/forum",
        component: RoundForumPostsRealstateComponent,
        data: { scopes: ["ROLE_INVESTOR"] },
    },
    {
        path: "round/:roundId/forum",
        component: RoundForumPostsRealstateComponent,
        data: { scopes: ["ROLE_INVESTOR"] },
    },
    {
        path: "round/:id",
        component: RoundInvestmentRealStateDetailsComponent,
        data: { scopes: ["ROLE_INVESTOR"] },
    },
    {
        path: "create",
        component: RoundRealStateDetailsComponent,
        data: { scopes: ["ROLE_ADMIN"] },
    },
    {
        path: "investments",
        component: RoundInvestimentsRealStateComponent,
        data: { scopes: ["ROLE_ADMIN"] },
    },
    {
        path: "investments/:id",
        component: RoundInvestimentsRealStateDetailsComponent,
        data: { scopes: ["ROLE_ADMIN"] },
    },
    {
        path: "cdi",
        component: RoundRealStateCdiComponent,
        data: { scopes: ["ROLE_ADMIN"] },
    },
    {
        path: "cdi/:id",
        component: RoundRealStateCdiCreateComponent,
        data: { scopes: ["ROLE_ADMIN"] },
    },
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoundIncorporatorRoutingModule { }
