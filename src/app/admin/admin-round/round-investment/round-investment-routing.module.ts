import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RoundInvestmentRealStateComponent } from './round-investment-real-state/round-investment-real-state.component';
import { RoundListComponent } from './round-list/round-list.component';

const routes: Routes = [
    {
        path: "",
        component: RoundListComponent,
        data: { scopes: ["ROLE_ADMIN"] },
    },
    {
        path: "incorporator/round/:id",
        component: RoundInvestmentRealStateComponent,
        data: { scopes: ["ROLE_INVESTOR"] },
    },
]


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoundInvestmentRoutingModule { }
