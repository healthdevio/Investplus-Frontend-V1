import { NumberMaskPipe } from './../core/pipes/number-mask.pipe';
import { AdminUserTrocarSenhaComponent } from './admin-user/admin-user-trocar-senha/admin-user-trocar-senha.component';
import { DateMaskPipe } from './../core/pipes/date-mask.pipe';
import { PhoneMaskPipe } from './../core/pipes/phone-mask.pipe';
import { CpfMaskPipe } from './../core/pipes/cpf-mask.pipe';
import { CnpjMaskPipe } from './../core/pipes/cnpj-mask.pipe';
import { CepMaskPipe } from './../core/pipes/cep-mask.pipe';
import { MoneyMaskPipe } from './../core/pipes/money-mask.pipe';
import { AdminRoutingModule } from "./admin-routing/admin-routing.module";
import { AdminFooterComponent } from "./admin-footer/admin-footer.component";
import { AdminLeftSideComponent } from "./admin-left-side/admin-left-side.component";
import { AdminHeaderComponent } from "./admin-header/admin-header.component";
import { AdminComponent } from "./admin.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminUserComponent } from "./admin-user/admin-user.component";
import { ShareModule } from "../share/share.module";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { TokenInterceptor } from "../interceptors/token.interceptor";
import { AdminUserPortfolioComponent } from "./admin-user/admin-user-portfolio/admin-user-portfolio.component";
import { Ng5SliderModule } from "ng5-slider";
import { AdminUserValuationComponent } from "./admin-user/admin-user-valuation/admin-user-valuation.component";
import { NgxPaginationModule } from "ngx-pagination";
import { AdminManagerComponent } from "./admin-manager/admin-manager.component";
import { AdminManagerInvestorsComponent } from "./admin-manager/admin-manager-investors/admin-manager-investors.component";
import { AdminUserIncommingComponent } from "./admin-user/admin-user-incomming/admin-user-incomming.component";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { AdminUserStatementComponent } from "./admin-user/admin-user-statement/admin-user-statement.component";
import { PipesModule } from "../core/pipes/pipes.module";
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';

defineLocale('pt-br', ptBrLocale);

@NgModule({
  imports: [
    PipesModule,
    CommonModule,
    AdminRoutingModule,
    ShareModule,
    Ng5SliderModule,
    HttpClientModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    PopoverModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    // Angular2ImageGalleryModule,
  ],
  declarations: [
    AdminComponent,
    AdminHeaderComponent,
    AdminLeftSideComponent,
    AdminFooterComponent,
    AdminUserComponent,
    AdminUserPortfolioComponent,
    AdminUserValuationComponent,
    AdminManagerComponent,
    AdminManagerInvestorsComponent,
    AdminUserIncommingComponent,
    AdminUserStatementComponent,
    AdminUserTrocarSenhaComponent
  ],
  providers: [
    MoneyMaskPipe,
    CpfMaskPipe,
    CepMaskPipe,
    CnpjMaskPipe,
    PhoneMaskPipe,
    DateMaskPipe,
    NumberMaskPipe,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true },
    // LoggedInGuard
    // { provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true },
  ],
  exports: [AdminComponent],
})
export class AdminModule {}
