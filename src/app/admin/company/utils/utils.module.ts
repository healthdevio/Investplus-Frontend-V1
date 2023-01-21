import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyService } from './service/company.service';
import { RoundsService } from './service/rounds.service';

@NgModule({
  imports: [
CommonModule
  ],
  providers: [
    CompanyService,
    RoundsService
  ],
  declarations: []
})
export class UtilsModule { }
