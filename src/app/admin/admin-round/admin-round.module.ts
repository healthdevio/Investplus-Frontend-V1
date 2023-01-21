import { ShareModule } from './../../share/share.module';
import { PipesModule } from './../../core/pipes/pipes.module';
import { AdminRoundRoutingModule } from './admin-round-routing.module';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AdminRoundComponentsModule } from './components/components.module';
import { RoundAssetsListComponent } from './round-assets-list/round-assets-list.component';
import { RoundFinishComponent } from "./round-finish/round-finish.component";
import { RoundTokenComponent } from "./round-token/round-token.component";
import { RoundCompanyIndicatorsComponent } from "./round-company-indicators/round-company-indicators.component";
import { RoundIncorporatorListComponent } from "./round-incorporator-list/round-incorporator-list.component";

import { AdminRoundComponent } from "./admin-round.component";

import { Ng5SliderModule } from 'ng5-slider';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    PipesModule,
    CommonModule,
    ShareModule,
    Ng5SliderModule,
    HttpClientModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    AdminRoundRoutingModule,
    AdminRoundComponentsModule,
  ],
  declarations: [
    AdminRoundComponent,
    RoundFinishComponent,
    RoundCompanyIndicatorsComponent,
    RoundTokenComponent,
    RoundIncorporatorListComponent,
    RoundAssetsListComponent
  ],
})
export class AdminRoundModule { }
