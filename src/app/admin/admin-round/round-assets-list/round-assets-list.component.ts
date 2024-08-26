import { AtivosTipo } from './../../../core/enums/ativos.enum';
import { Component, OnInit } from '@angular/core';
import { RoundService } from '../../../core/service/round.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TitleHeader } from '../../../core/interface/title-header';
import { TitleService } from '../../../core/service/title.service';
import { IIncorporator } from '../components/incorporator/IIncorporator';
import { ICompany } from '../components/company/ICompany';

declare var $: any;
declare var moment: any;
declare var toastr: any;

@Component({
  selector: 'app-round-assets-list',
  templateUrl: './round-assets-list.component.html',
  styleUrls: ['./round-assets-list.component.css']
})
export class RoundAssetsListComponent implements OnInit {

  form: FormGroup;
  titleHeader: TitleHeader;
  filterInvestment = '';
  filterAtivoType = AtivosTipo.STARTUP;

  imobiliarias: IIncorporator[] = [];
  empresas: ICompany[] = [];

  realStates: any;
  description = '';
  response: any;
  loader: boolean;
  errorMessage = '';
  suggestionMessage = '';
  score = '';
  responseError: boolean;

  public AtivosTipo = AtivosTipo;

  tiposAtivos = [
    { name: 'Imobiliárias', value: AtivosTipo.REALSTATE },
    { name: 'Startups', value: AtivosTipo.STARTUP },
  ];

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
    private data: TitleService
  ) { }

  ngOnInit() {

    this.data.currentMessage.subscribe(titles => this.titleHeader = titles);
    this.titleHeader.title = 'Investimentos / Ofertas Públicas';
    this.data.changeTitle(this.titleHeader);

    this.initForm();

    this.loader = true;
    this.responseError = false;
    this.roundService.getAllShortUser().subscribe(
      (response) => {
        this.response = response;
        this.empresas = response.companiesRounds;
        this.imobiliarias = response.realStateRounds;
        this.loader = false;
      }, (error) => {
        this.loader = false;
        this.responseError = true;
        this.errorMessage = 'Problema ao carregar as rodadas de investimento.';
        this.suggestionMessage = 'Recarregue a página ou tente novamente mais tarde.';
      });
  }

  selectedText: string = 'Todas as oportunidades';

  setSelectedText(text: string) {
    this.selectedText = text;
  }

  getColor(text: string): string {
    return this.selectedText === text ? '#035A7A' : 'inherit';
  }


  onDevelopmentToast() {
    toastr.options = {
      closeButton: true,
      debug: false,
      newestOnTop: false,
      progressBar: true,
      positionClass: "toast-top-right",
      preventDuplicates: true,
      onclick: null,
      showDuration: "300",
      hideDuration: "1000",
      timeOut: "10000",
      extendedTimeOut: "1000",
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
    };
    
    toastr.error('Em desenvolvimento');
  }

  initForm() {
    this.form = this.formBuilder.group({
      typeFilter: [''],
      typeAsset: [AtivosTipo.REALSTATE]
    });
  }
}
