import { Component, OnInit } from '@angular/core';
import { RoundService } from '../../../../core/service/round.service';

@Component({
  selector: 'app-round-real-state-cdi',
  templateUrl: './round-real-state-cdi.component.html',
  styleUrls: ['./round-real-state-cdi.component.css']
})
export class RoundRealStateCdiComponent implements OnInit {

  rounds: any;
  description = '';
  response: any;
  loader: boolean;
  errorMessage = '';
  responseError: boolean;
  textRegister = 'Nenhum registro encontrado.';
  p = 1;
  responsive = true;
  labels: any = {
      previousLabel: 'Anterior',
      nextLabel: 'Próximo'
  };

  constructor(
    private roundService: RoundService
  ) { }

  ngOnInit() {
    this.loader = true;
    this.responseError = false;
    this.roundService.getAllRounds().subscribe(
      (response) => {
        if (response.realStateRounds == null || response.realStateRounds.length === 0) {
          this.responseError = true;
          this.loader = false;
          return;
        }
        this.rounds = response.realStateRounds;
        this.loader = false;
        // this.response = response;
        // this.rounds = response.realStateRounds;
        // this.loader = false;
      }, (error) => {
        this.loader = false;
        this.responseError = true;
        this.errorMessage = 'Não possui rodada criada no momento';
    });
  }

  maskDescription(text) {
    return text.substring(0, 220) + '...';
  }
}
