import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientModule } from '@angular/common/http';
import { Ng5SliderModule } from 'ng5-slider';
import { ShareModule } from './../../../share/share.module';
import { PipesModule } from './../../../core/pipes/pipes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundCompanyComponent } from './company/company.component';
import { RoundIncorporatorComponent } from './incorporator/incorporator.component';
import { RoundInvestmentDetailsComponent } from './round-investment-details/round-investment-details.component';
import { CardMemberComponent } from './card-member/card-member.component';
@NgModule({
    imports: [
        PipesModule,
        CommonModule,
        RouterModule,
        ShareModule,
        Ng5SliderModule,
        HttpClientModule,
        NgxPaginationModule,
        Ng2SearchPipeModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        RoundCompanyComponent,
        RoundIncorporatorComponent,
        RoundInvestmentDetailsComponent,
        CardMemberComponent
    ],
    exports: [
        RoundCompanyComponent,
        RoundIncorporatorComponent,
        RoundInvestmentDetailsComponent,
        CardMemberComponent
    ]
})
export class AdminRoundComponentsModule { }
