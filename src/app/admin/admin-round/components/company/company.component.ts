import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalityService } from '../../../../core/service/modality.service';
import { ICompany } from './ICompany';

@Component({
  selector: 'admin-round-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})

export class RoundCompanyComponent {
  @Input() company: ICompany = null;

  constructor(
    public sanitizer: DomSanitizer,
    private modalityService: ModalityService
  ) { }

  maskStatus(status: string): string {
    if (status === 'IN_PROGRESS') {
      return 'ANDAMENTO';
    } else if (status === 'FINISHED') {
      return 'CONCLUÍDO';
    } else {
      return '';
    }
  }

  maskModality(modality: string): string {
    return this.modalityService.getModality(modality)?.description;
  }

  maskGuarantee(guarantee: string): string {
    let maskGuarantee = '';
    switch (guarantee) {
      case 'T':
        maskGuarantee = 'TÍTULO CONVERSÍVEL';
        break;
      case 'A':
        maskGuarantee = 'AVALISTAS';
        break;
    }
    return maskGuarantee;
  }

  maskScore(score: any): string {
    let maskScore = '';
    switch (score) {
      case 5:
        maskScore = 'A';
        break;
      case 4:
        maskScore = 'B';
        break;
      case 3:
        maskScore = 'C';
        break;
      case 2:
        maskScore = 'D';
        break;
      case 1:
        maskScore = 'E';
        break;
    }
    return maskScore;
  }

  maskProgress(total, maximumValuation): string {
    return Number(((total / maximumValuation) * 100).toFixed(2)) + '%';
  }
}
