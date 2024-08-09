import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalityService } from '../../../../core/service/modality.service';
import { ICompany } from './ICompany';

@Component({
  selector: 'admin-round-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})

export class RoundCompanyComponent implements OnInit {
  @Input() company: ICompany = null;


  constructor(
    public sanitizer: DomSanitizer,
    private modalityService: ModalityService
  ) { }

  ngOnInit() {
    const companyData = JSON.stringify([this.company]); 
    localStorage.setItem('companyData', companyData);
  }

  maskStatus(status: string): string {
    if (status === 'IN_PROGRESS') {
      return 'ANDAMENTO';
    } else if (status === 'FINISHED') {
      return 'CONCLUÍDO';
    } else {
      return '';
    }
  }
  
  atualizarRound() {
    const roundId = this.company.round.id;
    const localStorageData = localStorage.getItem('companyData');
    let localStorageArray = [];
  
    if (localStorageData) {
      try {
        localStorageArray = JSON.parse(localStorageData);

        if (!Array.isArray(localStorageArray)) {
          localStorageArray = [localStorageArray]; 
        }
      } catch (error) {
        console.error('Erro ao parsear localStorageData', error);
        localStorageArray = [];
      }
    }
  
    const existingIndex = localStorageArray.findIndex(obj => obj.round.id === roundId);
  
    if (existingIndex !== -1) {
      localStorageArray[existingIndex] = this.company;
    } else {
      localStorageArray.push(this.company);
    }
  
    localStorage.setItem('companyData', JSON.stringify(localStorageArray));
  }  

  handleClick() {
    this.atualizarRound();
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

  formatParticipation(value: number): string {
    const percentage = (value * 100).toFixed(6);
    return parseFloat(percentage) === 0 ? "<0.000001%" : `${percentage}%`;
  }

  maskProgress(total, maximumValuation): string {
    return Number(((total / maximumValuation) * 100).toFixed(2)) + '%';
  }
}
