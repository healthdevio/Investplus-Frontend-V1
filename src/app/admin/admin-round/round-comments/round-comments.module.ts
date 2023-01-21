import { AdminRoundCommentsRoutingModule } from './round-comments-routings.module';
import { NgModule } from '@angular/core';
import { AdminRoundComponentsModule } from './../components/components.module';
import { AdminRoundRoutingModule } from './../admin-round-routing.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientModule } from '@angular/common/http';
import { Ng5SliderModule } from 'ng5-slider';
import { ShareModule } from './../../../share/share.module';
import { CommonModule } from '@angular/common';
import { PipesModule } from './../../../core/pipes/pipes.module';


import { RoundCommentsComponent } from "./round-comments/round-comments.component";
import { RoundCommentsEditComponent } from "./round-comments-edit/round-comments-edit.component";;

@NgModule({
    imports: [
      PipesModule,
      CommonModule,
      ShareModule,
      Ng5SliderModule,
      HttpClientModule,
      NgxPaginationModule,
      Ng2SearchPipeModule,
      AdminRoundCommentsRoutingModule
    ],
    declarations: [
        RoundCommentsComponent,
        RoundCommentsEditComponent
    ]
})
export class AdminRoundCommentsModule { }
