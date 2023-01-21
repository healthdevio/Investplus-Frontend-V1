import { AdminRoundComponentsModule } from './../components/components.module';
import { AdminRoundApprovalRoutingModule } from './round-approval-routing.module';
import { ShareModule } from './../../../share/share.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from './../../../core/pipes/pipes.module';
import { Ng5SliderModule } from 'ng5-slider';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RoundApprovalCreateComponent } from './round-approval-create/round-approval-create.component';
import { RoundApprovalDetailsComponent } from './round-approval-details/round-approval-details.component';
import { RoundApprovalDocsDetailsComponent } from './round-approval-docs-details/round-approval-docs-details.component';
import { RoundApprovalDocsComponent } from './round-approval-docs/round-approval-docs.component';
import { RoundApprovalListComponent } from './round-approval-list/round-approval-list.component';
import { RoundCompanyApprovalComponent } from './round-company-approval/round-company-approval.component';
import { RoundRealStatePublishComponent } from './round-real-state-publish/round-real-state-publish.component';
import { RoundCompanyPublishComponent } from './round-company-publish/round-company-publish.component';

@NgModule({
  imports: [
    PipesModule,
    CommonModule,
    ShareModule,
    Ng5SliderModule,
    HttpClientModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoundApprovalRoutingModule,
    AdminRoundComponentsModule
  ],
  declarations: [
    RoundApprovalCreateComponent,
    RoundApprovalDetailsComponent,
    RoundApprovalDocsDetailsComponent,
    RoundApprovalDocsComponent,
    RoundApprovalListComponent,
    RoundCompanyApprovalComponent,
    RoundRealStatePublishComponent,
    RoundCompanyPublishComponent
  ]
})
export class AdminRoundApprovalModule { }
