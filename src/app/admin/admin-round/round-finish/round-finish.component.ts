import { Component, OnInit } from '@angular/core';
import { RoundService } from '../../../core/service/round.service';

@Component({
  selector: 'app-round-finish',
  templateUrl: './round-finish.component.html',
  styleUrls: ['./round-finish.component.css']
})
export class RoundFinishComponent implements OnInit {

  rounds: any;
  realStates: any;
  description = '';
  response: any;
  loader: boolean;
  errorMessage = '';
  suggestionMessage = '';
  responseError: boolean;
  status: 'FINISH';

  constructor(
    private roundService: RoundService
  ) { }

  ngOnInit() {
    this.loader = true;
    this.responseError = false;
    this.roundService.getAllByStatus(this.status).subscribe(
      (response) => {
        this.response = response;
        this.loader = false;
      }, (error) => {
        this.loader = false;
        this.responseError = true;
        this.errorMessage = 'Problema ao carregar as rodadas de investimento.';
        this.suggestionMessage = 'Recarregue a página ou tente novamente mais tarde.';
    });
  }

  maskDescription(text) {
    return text.substring(0, 225) + '...';
  }

}
