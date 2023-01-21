import { Component, OnInit } from '@angular/core';
import { RoundService } from '../../../core/service/round.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TitleHeader } from '../../../core/interface/title-header';
import { TitleService } from '../../../core/service/title.service';
import { ModalityService } from '../../../core/service/modality.service';

declare var $: any;
declare var moment: any;

@Component({
  selector: 'app-round-incorporator-list',
  templateUrl: './round-incorporator-list.component.html',
  styleUrls: ['./round-incorporator-list.component.css']
})
export class RoundIncorporatorListComponent implements OnInit {

  form: FormGroup;
  titleHeader: TitleHeader;
  filterInvestment = '';
  rounds: any;
  realStates: any;
  description = '';
  response: any;
  loader: boolean;
  errorMessage = '';
  suggestionMessage = '';
  score = '';
  responseError: boolean;

  p = 1;
  q = 1;
  responsive = true;
  labels: any = {
    previousLabel: 'Anterior',
    nextLabel: 'Próximo'
  };

  constructor(
    private roundService: RoundService,
    private formBuilder: FormBuilder,
    private data: TitleService,
    private modalityService: ModalityService
  ) {}

  ngOnInit() {

    this.data.currentMessage.subscribe(titles => this.titleHeader = titles);
    this.titleHeader.title = 'Investimentos / Rodadas de Investimento';
    this.data.changeTitle(this.titleHeader);

    this.initForm();

    this.loader = true;
    this.responseError = false;
    this.roundService.getAllShortUser().subscribe(
      (response) => {
        this.response = response;
        this.rounds = response.realStateRounds;
        this.realStates = response.realStateRounds;
        console.log(this.rounds);
        this.loader = false;
      }, (_error) => {
        this.loader = false;
        this.responseError = true;
        this.errorMessage = 'Problema ao carregar as rodadas de investimento.';
        this.suggestionMessage = 'Recarregue a página ou tente novamente mais tarde.';
      });
  }

  initForm() {
    this.form = this.formBuilder.group({
      typeFilter: ['']
    });
  }

  public maskDescription(text): string {
    return text.substring(0, 225) + '...';
  }

  public dateFinishAt(startedAt, duration): any {
    return moment(startedAt, 'YYYY-MM-DD').add('days', duration).format('DD/MM/YYYY');
  }

  public maskProgress(total, maximumValuation): string {
    return Number(((total / maximumValuation) * 100).toFixed(0)) + '%';
  }

  public maskStatus(status: string): string {
    if (status === 'IN_PROGRESS') {
      return 'ANDAMENTO';
    } else if (status === 'FINISHED') {
      return 'CONCLUÍDO';
    } else {
      return '';
    }
  }

  public maskScore(score: any): string {
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

  public maskModality(modality: string): string {
    return this.modalityService.getModality(modality)?.description;
  }

  public maskGuarantee(guarantee: string): string {
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

}
