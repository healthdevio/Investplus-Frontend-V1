import { LoaderService } from './service/loader.service';
import { PasswordStrengthService } from './service/PasswordStrengthService.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from './service/user.service';
import { CrudService } from './service/crud.service';
import { InvestorService } from './service/investor.service';
import { CompanyService } from './service/company.service';
import { AuthService } from './service/auth.service';
import { UserLoginService } from './service/cognito/user-login.service';
import { AwsUtil } from './service/cognito/aws.service';
import { CognitoUtil } from './service/cognito/cognito.service';
import { RoundService } from './service/round.service';
import { UserRegistrationService } from './service/cognito/user-registration.service';
import { InvestmentService } from './service/investment.service';
import { EventEmitterService } from './service/event-emitter-service.service';
import { ForumService } from './service/forum.service';
import { SendAutomaticService } from './service/send-automatic.service';
import { RealStateService } from './service/real-state.service';
import { ExcelService } from './service/excel.service';
import { CompanyCaptableService } from './service/company-captable.service';
import { CompanyFinancialService } from './service/company-financial.service';
import { InvestmentInstallmentService } from './service/investment-installment.service';
import { TitleService } from './service/title.service';
import { PipesModule } from './pipes/pipes.module';
import { CompanyPartnersService } from './service/company-partners.service';
import { BankService } from './service/bank.service';

@NgModule({
  imports: [
    CommonModule,
    PipesModule
  ],
  providers: [
    TitleService,
    UserService,
    CrudService,
    InvestorService,
    CompanyService,
    AuthService,
    InvestmentService,
    UserLoginService,
    CognitoUtil,
    RoundService,
    ForumService,
    RealStateService,
    UserRegistrationService,
    AwsUtil,
    EventEmitterService,
    SendAutomaticService,
    ExcelService,
    CompanyCaptableService,
    CompanyFinancialService,
    InvestmentInstallmentService,
    LoaderService,
    PasswordStrengthService,
    CompanyPartnersService,
    BankService
  ],
  declarations: [

  ],
})
export class CoreModule { }
