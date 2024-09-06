import { AtivosTipo } from './../../../core/enums/ativos.enum';
import { Component, OnInit } from '@angular/core';
import { RoundService } from '../../../core/service/round.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TitleHeader } from '../../../core/interface/title-header';
import { TitleService } from '../../../core/service/title.service';
import { IIncorporator } from '../components/incorporator/IIncorporator';
import { ICompany } from '../components/company/ICompany';

declare var toastr: any;

@Component({
  selector: 'app-round-assets-list',
  templateUrl: './round-assets-list.component.html',
  styleUrls: ['./round-assets-list.component.css']
})
export class RoundAssetsListComponent implements OnInit {

  private allEmpresas: ICompany[] = [];
  private allImobiliarias: IIncorporator[] = [];
  
  empresas: ICompany[] = [];
  imobiliarias: IIncorporator[] = [];

  form: FormGroup;
  titleHeader: TitleHeader;
  filterInvestment = '';
  filterAtivoType = AtivosTipo.STARTUP;

  loader: boolean;
  errorMessage = '';
  suggestionMessage = '';
  responseError: boolean;

  public AtivosTipo = AtivosTipo;

  tiposAtivos = [
    { name: 'Imobiliárias', value: AtivosTipo.REALSTATE },
    { name: 'Startups', value: AtivosTipo.STARTUP },
  ];

  sessionsTable = [
    {
      name: "Total"
    },
    {
      name: "Andamento"
    },
    {
      name: "Concluidas"
    },
  ]

  selectedSession = "Total";

  selectSession(sessionName: string) {
    this.selectedSession = sessionName;
    this.applyFiltersMobile();
  }

  p = 1;
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
    this.loadAllRounds();
  }
  
  selectedText: string = 'Todas as oportunidades';

  setSelectedText(text: string) {
    this.selectedText = text;
    this.applyFilters();
  }  

  applyFilters(searchTerm: string = '') {
    let status = this.selectedText === 'Andamento' ? 'IN_PROGRESS' :
      this.selectedText === 'Concluidas' ? 'FINISHED' : null;
  
    searchTerm = searchTerm.toLowerCase();
  
    this.empresas = this.allEmpresas.filter(company => {
      const matchesStatus = status ? company.round.status === status : true;
      const matchesSearch = company.name.toLowerCase().includes(searchTerm);
      return matchesStatus && matchesSearch;
    });
    
    this.imobiliarias = this.allImobiliarias.filter(realState => {
      const matchesStatus = status ? realState.status === status : true;
      const matchesSearch = realState.name.toLowerCase().includes(searchTerm);
      return matchesStatus && matchesSearch;
    });
  
  }

  applyFiltersMobile(searchTerm: string = '') {
    let status = this.selectedSession === 'Andamento' ? 'IN_PROGRESS' :
      this.selectedSession === 'Concluidas' ? 'FINISHED' : null;

    searchTerm = searchTerm.toLowerCase();

    this.empresas = this.allEmpresas.filter(company => {
      const matchesStatus = status ? company.round.status === status : true;
      const matchesSearch = company.name.toLowerCase().includes(searchTerm);
      return matchesStatus && matchesSearch;
    });

    this.imobiliarias = this.allImobiliarias.filter(realState => {
      const matchesStatus = status ? realState.status === status : true;
      const matchesSearch = realState.name.toLowerCase().includes(searchTerm);
      return matchesStatus && matchesSearch;
    });

  }
  

  loadAllRounds() {
    this.loader = true;
    this.responseError = false;
  
    this.roundService.getAllShortUser().subscribe(
      (response) => {
        this.allEmpresas = response.companiesRounds || [];
        this.allImobiliarias = response.realStateRounds || [];
        this.empresas = [...this.allEmpresas]; 
        this.imobiliarias = [...this.allImobiliarias]; 
        this.loader = false;

        // Aplicar filtros inicialmente para garantir a exibição correta
        this.applyFilters();
      }, (error) => {
        this.loader = false;
        this.responseError = true;
        this.errorMessage = 'Problema ao carregar as rodadas de investimento.';
        this.suggestionMessage = 'Recarregue a página ou tente novamente mais tarde.';
      });
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
    
    toastr.success('Em desenvolvimento');
  }

  initForm() {
    this.form = this.formBuilder.group({
      search: [''] 
    });
    this.form.get('search').valueChanges.subscribe(() => this.applyFilters());
  }
}
