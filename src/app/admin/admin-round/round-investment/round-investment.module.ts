import { AdminRoundInvestmentRoutingModule } from './round-investment-routing.module';
import { NgModule } from '@angular/core';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientModule } from '@angular/common/http';
import { Ng5SliderModule } from 'ng5-slider';
import { ShareModule } from './../../../share/share.module';
import { CommonModule } from '@angular/common';
import { PipesModule } from './../../../core/pipes/pipes.module';

import { RoundInvestmentRealStateComponent } from './round-investment-real-state/round-investment-real-state.component';
import { RoundListComponent } from './round-list/round-list.component';


@NgModule({
    imports: [
        PipesModule,
        CommonModule,
        ShareModule,
        Ng5SliderModule,
        HttpClientModule,
        NgxPaginationModule,
        Ng2SearchPipeModule,
        AdminRoundInvestmentRoutingModule
    ],
    declarations: [
        RoundInvestmentRealStateComponent,
        RoundListComponent
    ],
})
export class AdminRoundInvestmentModule { }
