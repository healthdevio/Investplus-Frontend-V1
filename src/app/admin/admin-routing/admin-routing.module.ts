import { AdminUserTrocarSenhaComponent } from './../admin-user/admin-user-trocar-senha/admin-user-trocar-senha.component';
import { AdminUserComponent } from "./../admin-user/admin-user.component";
import { AdminComponent } from "./../admin.component";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AdminUserPortfolioComponent } from "../admin-user/admin-user-portfolio/admin-user-portfolio.component";
import { AdminUserValuationComponent } from "../admin-user/admin-user-valuation/admin-user-valuation.component";
import { AdminManagerInvestorsComponent } from "../admin-manager/admin-manager-investors/admin-manager-investors.component";
import { RouteGuard } from "../../guards/route.guard";
import { AdminUserIncommingComponent } from "../admin-user/admin-user-incomming/admin-user-incomming.component";
import { AdminUserStatementComponent } from "../admin-user/admin-user-statement/admin-user-statement.component";
import { RoundTokenComponent } from '../admin-round/round-token/round-token.component';
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: "",
        component: AdminComponent,
        canLoad: [RouteGuard],
        canActivate: [RouteGuard],
        canActivateChild: [RouteGuard],
        children: [
          { path: "", redirectTo: "rounds", pathMatch: "full" },
          {
            path: "rounds/token",
            component: RoundTokenComponent
          },
          {
            path: "portfolio",
            component: AdminUserPortfolioComponent,
            data: { scopes: ["ROLE_INVESTOR"] },
          },
          {
            path: "incomming",
            component: AdminUserIncommingComponent,
            data: { scopes: ["ROLE_INVESTOR"] },
          },
          {
            path: "statement",
            component: AdminUserStatementComponent,
            data: { scopes: ["ROLE_INVESTOR"] },
          },
          {
            path: "investors",
            component: AdminManagerInvestorsComponent,
            data: { scopes: ["ROLE_ADMIN"] },
          },
          {
            path: "valuation/company/:id/round/:id2/incomming/:id3",
            component: AdminUserValuationComponent,
            data: { scopes: ["ROLE_INVESTOR"] },
          },
          {
            path: "user",
            data: { scopes: ["ROLE_INVESTOR"] },
            children: [
              { path: "", redirectTo: "perfil", pathMatch: "full" },
              {
                path: "perfil",
                component: AdminUserComponent,
                data: { scopes: ["ROLE_INVESTOR"] },
              },
              {
                path: "trocar-senha",
                component: AdminUserTrocarSenhaComponent
              },
            ],
          },
          {
            path: 'rounds',
            loadChildren: () => import('../admin-round/admin-round.module').then((m) => m.AdminRoundModule),
          },
          {
            path: "company",
            loadChildren: () => import('../company/company.module').then(m => m.CompanyModule),
            data: { scopes: ["ROLE_COMPANY"] },
          },
        ],
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
