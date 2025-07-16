import { Component, OnInit } from '@angular/core';
import { RoundService } from '../../../../core/service/round.service';
import { ExcelService } from '../../../../core/service/excel.service';
import { TitleService } from '../../../../core/service/title.service';
import { TitleHeader } from '../../../../core/interface/title-header';

@Component({
  selector: 'app-round-investments',
  templateUrl: './round-investments.component.html',
  styleUrls: ['./round-investments.component.css']
})

export class RoundInvestmentsComponent implements OnInit {

  titleHeader: TitleHeader;
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

  constructor(private roundService: RoundService,
    private excelService: ExcelService,
    private data: TitleService) { }

  ngOnInit() {

    this.data.currentMessage.subscribe(titles => this.titleHeader = titles);
    this.titleHeader.title = 'Administração / Investimentos Realizados';
    this.data.changeTitle(this.titleHeader);

    this.loader = true;
    this.responseError = false;
    this.roundService.getAllRounds().subscribe(
      (response) => {
        this.response = response;
        console.log(response)
        this.rounds = response.companiesRounds;
        this.loader = false;
      }, (error) => {
        this.loader = false;
        this.responseError = true;
        this.errorMessage = 'Não possui rodada criada no momento';
    });
  }

  maskDescription(text) {
    return text.substring(0, 220) + '...';
  }

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.rounds, 'investors');
  }

}
