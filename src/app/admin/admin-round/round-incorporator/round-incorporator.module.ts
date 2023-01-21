import { NgModule } from '@angular/core';
import { AdminRoundIncorporatorRoutingModule } from './round-incorporator-routing.module';
import { ShareModule } from './../../../share/share.module';
import { CommonModule } from '@angular/common';
import { PipesModule } from './../../../core/pipes/pipes.module';
import { Ng5SliderModule } from 'ng5-slider';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { RoundForumPostsRealstateComponent } from './round-forum-posts-realstate/round-forum-posts-realstate.component';
import { RoundInvestimentsRealStateDetailsComponent } from './round-investiments-real-state-details/round-investiments-real-state-details.component'
import { RoundInvestimentsRealStateComponent } from './round-investiments-real-state/round-investiments-real-state.component';
import { RoundInvestmentRealStateDetailsComponent } from './round-investment-real-state-details/round-investment-real-state-details.component';
import { RoundRealStateCdiCreateComponent } from './round-real-state-cdi-create/round-real-state-cdi-create.component';
import { RoundRealStateCdiComponent } from './round-real-state-cdi/round-real-state-cdi.component';
import { RoundRealStateDetailsComponent } from './round-real-state-details/round-real-state-details.component';

@NgModule({
    imports: [
        PipesModule,
        CommonModule,
        ShareModule,
        Ng5SliderModule,
        HttpClientModule,
        NgxPaginationModule,
        Ng2SearchPipeModule,
        AdminRoundIncorporatorRoutingModule
    ],
    declarations: [
        RoundForumPostsRealstateComponent,
        RoundInvestimentsRealStateDetailsComponent,
        RoundInvestimentsRealStateComponent,
        RoundInvestmentRealStateDetailsComponent,
        RoundRealStateCdiCreateComponent,
        RoundRealStateCdiComponent,
        RoundRealStateDetailsComponent
    ],
})
export class AdminRoundIncorporatorModule { }
