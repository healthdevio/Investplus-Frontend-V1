import { Component, OnInit, SecurityContext } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, FormControl } from "@angular/forms";
import { Options } from "ng5-slider";
import { finalize } from 'rxjs/operators';

import { LoaderService } from './../../../../core/service/loader.service';
import { DateMaskPipe } from './../../../../core/pipes/date-mask.pipe';
import { MoneyMaskPipe } from './../../../../core/pipes/money-mask.pipe';
import { RoundService } from "../../../../core/service/round.service";
import { CompanyService } from "../../../../core/service/company.service";
import { InvestmentService } from "../../../../core/service/investment.service";
import { SendAutomaticService } from "../../../../core/service/send-automatic.service";
import { TitleService } from "../../../../core/service/title.service";
import { TitleHeader } from "../../../../core/interface/title-header";
import { CompanyCaptableService } from '../../../../core/service/company-captable.service';
import { ModalityService } from '../../../../core/service/modality.service';
import { TiposModalidades } from './../../../../core/enums/modalidades.enum';

declare var $: any;
declare var bootbox: any;
declare var toastr: any;
declare var moment: any;

@Component({
  selector: "app-round-investment-details",
  templateUrl: "./round-investment-details.component.html",
  styleUrls: ["./round-investment-details.component.css"],
})
export class RoundInvestmentDetailsComponent implements OnInit {
  companyDataComplete: any;
  selectedTab: string = 'presentation';
  form: FormGroup;
  companyData: any;
  titleHeader: TitleHeader;
  roundInvestment: any = {}; 
  companyInvestment: any;
  quotaValue = 0;
  startedAt: any;
  finishAt: any;
  status = "";
  porcent = "";
  disabled = false;
  dataResume = [];
  optionsResume: any;
  optionScore: any;
  labelScore = [];
  dataScore = [];
  score = "";
  loader: boolean;
  loading: boolean = false;
  quotas = 0;
  quotasSold = 0;
  offerVideo: SafeResourceUrl;
  executives: any;
  advices: any;
  investments: any;
  valuation = {
    current: 0,
    shortTerm: 0,
    longTerm: 0,
  };
  company = 0;
  rounds = 0;
  amountQuota = 1;
  options: Options = {
    floor: 1,
    ceil: 300,
  };
  box = "box";
  indicators: any[] = [];
  captable: any = {
    data: [],
    colors: [],
    labels: [],
    options: {
      legend: {
        display: true,
      },
      animation: {
        duration: 4000,
      },
      cutoutPercentage: 95,
    },
  };
  objective: any;
  invested: any;

  socialLinks = ['facebook', 'linkedin', 'twitter', 'website'];
  socialIcons = {
    facebook: 'fa fa-fw fa-facebook-square',
    linkedin: 'fa fa-fw fa-linkedin-square',
    twitter: 'fa fa-fw fa-twitter-square',
    website: 'fa fa-fw fa-globe',
  };

  documents = [
    { key: 'presentationOffer', label: 'Oferta pública', docUrl: 'docPresentationOffer' },
    { key: 'presentationInvestors', label: 'Apres. aos investidores', docUrl: 'docPresentationInvestors' },
    { key: 'legalDocuments', label: 'Doc. jurídicos', docUrl: 'docLegalDocuments' },
    { key: 'valuationDoc', label: 'Valuation', docUrl: 'docValuation' },
    { key: 'fiscalDossier', label: 'Dossiê Fiscal', docUrl: 'docFiscalDossier' },
  ];

  constructor(
    private activedRouter: ActivatedRoute,
    private roundService: RoundService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private valuationService: CompanyService,
    private investmentService: InvestmentService,
    private sendAutomaticService: SendAutomaticService,
    private companyService: CompanyService,
    private maskMoneyPipe: MoneyMaskPipe,
    private data: TitleService,
    private dateMask: DateMaskPipe,
    private loaderService: LoaderService,
    private captableService: CompanyCaptableService,
    private modalityService: ModalityService,
  ) { }

  ngOnInit() {
    this.activedRouter.params.subscribe((params) => {
      this.company = params["id"];
      this.rounds = Number(params["id2"]);
    });

    this.loader = true;

    const localStorageData = localStorage.getItem('companyData');

    if(localStorageData) { 
      const companies = JSON.parse(localStorageData);
      const targetCompany = companies.find(company => company.id == this.company);
      this.companyDataComplete = targetCompany;
    }

    this.getCompanyIndicators(this.company);
    this.getRound();
    this.initForm();
    this.getValuation();
    this.getCaptable();

    const $this = this;
    setTimeout(function () {
      $this.box = "box collapsed-box";
    }, 4000);
  }

  private getRound(): void {
    this.roundService
      .getRound(this.company, this.rounds)
      .subscribe((response) => {
        this.roundInvestment = response || {};
        this.quotaValue = response.round?.quotaValue ?? 0;
        this.startedAt = this.dateMask.transform(response.round?.startedAt);
        this.finishAt = moment(this.startedAt, "DD-MM-YYYY")
          .add("days", response.round?.duration)
          .format("DD/MM/YYYY");
        this.status = response.round?.status ?? '';
        if (this.companyDataComplete?.round) {
          this.porcent =
            Number(
              (
                (this.companyDataComplete.round.resume.total / this.companyDataComplete.round.maximumValuation) *
                100
              ).toFixed(2) 
            ) + "%";
        }        
        this.offerVideo = this.getEmbeddedVideoUrl(this.sanitizer.bypassSecurityTrustResourceUrl(response.round?.offerVideo ?? ''));
        this.quotas = response.round?.quotas ?? 0;
        this.quotasSold = response.round?.resume?.quotasSold ?? 0;
        this.executives = response.executives || [];
        this.advices = response.advices || [];
        this.investments = response.round?.investments || [];
        this.options.ceil = this.quotas - this.quotasSold;

        this.data.currentMessage.subscribe(
          (titles) => (this.titleHeader = titles)
        );
        this.titleHeader.title =
          "Investimentos / Oportunidades / " +
          this.titleCase(this.roundInvestment?.name ?? '');
        this.data.changeTitle(this.titleHeader);

        switch (this.status) {
          case "IN_PROGRESS":
            this.disabled = false;
            break;
          default:
            this.disabled = true;
            this.form.get("installments")?.disable();
            this.form.get("publicAccess")?.disable();
            this.form.get("quotas")?.disable();
            this.options.disabled = true;
            break;
        }

        if (this.companyDataComplete?.round) {
          this.dataResume = [
            (
              100 -
              (this.companyDataComplete.round.resume.total / this.companyDataComplete.round.maximumValuation) *
              100
            ).toFixed(1),
            (
              (this.companyDataComplete.round.resume.total / this.companyDataComplete.round.maximumValuation) *
              100
            ).toFixed(2),
          ];
        }

        this.optionsResume = {
          legend: {
            display: false,
          },
          animation: {
            duration: 1000,
          },
          cutoutPercentage: 90
        };

        this.optionScore = {
          legend: {
            display: false,
          },
          scale: {
            angleLines: {
              display: false,
            },
            ticks: {
              beginAtZero: true,
              max: 5,
              min: 0,
              stepSize: 1,
            },
          },
        };

        this.loader = false;
      });
  }

  getEmbeddedVideoUrl(url: SafeResourceUrl): SafeResourceUrl {
    const videoId = this.extractVideoId(url);
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
  }
  
  private extractVideoId(url: SafeResourceUrl): string | null {
    const urlString = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, url);
    const match = urlString?.match(
      /(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))(.*?)(?:[?&]t=|&|$)/
    );
    return match && match[1] ? match[1] : null;
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      quotas: [null, [this.quotaValidator()]],
      investment: [null],
      publicAccess: [false],
      installments: ["1", [Validators.required]],
    });
  }

  public onSubmit(): void {
    if (this.status !== "IN_PROGRESS") {
      bootbox.confirm({
        title: "Confirmação",
        message: "A rodada de investimento já foi concluída.",
        buttons: {
          confirm: {
            label: "Entendi",
            className: "bg-upangel",
          },
          cancel: {
            label: "Cancelar",
            className: "bg-upangel",
          },
        },
        callback: function (result) { },
      });
    } else {
      const $this = this;

      bootbox.confirm({
        title: "Confirmação",
        message:
          "Você confirma o investimento de " +
          this.form.controls["quotas"].value +
          " cota(s) no valor de " +
          this.maskMoneyPipe.transform(this.amountQuota * this.quotaValue) +
          "?",
        buttons: {
          confirm: {
            label: "Confirmar",
            className: "bg-upangel",
          },
          cancel: {
            label: "Cancelar",
            className: "bg-upangel",
          },
        },
        callback: function (result) {
          if (result === true) {
            $this.makeInvestment();
          }
        },
      });
    }
  }

  private quotaValidator(): ValidatorFn {
    return (
      control: AbstractControl
    ): {
      [key: string]: boolean;
    } | null => {
      if (
        control.value !== undefined &&
        (isNaN(control.value) || control.value <= 0)
      ) {
        return {
          quotaRange: true,
        };
      }
      return null;
    };
  }

  private titleCase(str: string): string {
    let str2 = [];
    str2 = str.toLowerCase().split(" ");
    for (let i = 0; i < str2.length; i++) {
      str2[i] = str2[i].charAt(0).toUpperCase() + str2[i].slice(1);
    }
    return str2.join(" ");
  }

  public maskStatus(status): string {
    switch (status) {
      case "IN_PROGRESS":
        return "Andamento";
      case "FINISHED":
        return "Concluída";
      default:
        return "";
    }
  }

  public maskModel(model: string): string {
    const aux = TiposModalidades[model];
    if (!aux) {
      return ""
    }

    return aux;
  }

  public maskScore(score: any): string {
    let maskScore = "";
    switch (score) {
      case 5:
        maskScore = "A";
        break;
      case 4:
        maskScore = "B";
        break;
      case 3:
        maskScore = "C";
        break;
      case 2:
        maskScore = "D";
        break;
      case 1:
        maskScore = "E";
        break;
      default:
        maskScore = "--";
        break;
    }
    return maskScore;
  }

  public validateAllFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({
          onlySelf: true,
        });
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control);
      }
    });
  }

  private getCompanyIndicators(id: number): void {
    this.companyService.getCompanyIndicators(id).subscribe((response) => {
      this.score = response.score;

      const indicatos = [
        {
          value: response?.cac ? this.maskMoneyPipe.transform(response?.cac) : 0,
          label: "CAC",
          tooltip: "É o quanto se gasta para conseguir um novo cliente"
        },
        {
          value: response?.cmv ? this.maskMoneyPipe.transform(response?.cmv) : 0,
          label: "Custo Médio de Vendas",
          tooltip: "Custo Médio de Vendas"
        },
        {
          value: response.averageTicket ? this.maskMoneyPipe.transform(response.averageTicket) : 0,
          label: "Ticket Médio",
          tooltip: "É o valor médio que cada cliente paga a empresa"
        },
        {
          value: response?.ltv ? this.maskMoneyPipe.transform(response?.ltv) : 0,
          label: "Lifetime Value",
          tooltip: "Mensura o quanto um cliente gera para uma empresa enquanto mantém um relacionamento com ela"
        },
        {
          value: response.activeCustomers,
          label: "Clientes ativos",
          tooltip: "Número de clientes que estão pagando a startup"
        },
        {
          value: response.cashburnIndicator,
          label: "Cashburn",
          tooltip: "Tempo em que o caixa da empresa aguenta com o fluxo de caixa corrente"
        },
        {
          value: response?.ltvCac ? `${this.maskMoneyPipe.transform(response?.ltvCac)}x` : 0,
          label: "LTV/CAC",
          tooltip: "Multiplicador do quanto a startup ganha ao adquirir um novo cliente"
        },
        {
          value: response?.valuation,
          label: "Valuation",
          tooltip: "Valor da empresa no momento"
        },
        {
          value: response?.sharePriceIndicator ? `${this.maskMoneyPipe.transform(response?.sharePriceIndicator)}` : 0,
          label: "Preço por Ação",
          tooltip: "Preço da ação da empresa na rodada"
        }
      ];

      this.indicators = indicatos.filter(indicator => indicator.value);

      this.labelScore = [
        "Tecnologia",
        "Estratégia",
      ];
      this.dataScore = [
        response.technologyIndicator,
        response.strategicIndicator,
      ];
    });
  }

  public getValuation(): void {
    this.valuationService
      .getValuation(this.company)
      .subscribe((responseGetValuation) => {
        this.valuation.current = responseGetValuation.current;
        this.valuation.shortTerm = responseGetValuation.shortTerm;
        this.valuation.longTerm = responseGetValuation.longTerm;
      });
  }

  public makeInvestment(): void {
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
  
    const dataSend = this.form.value;
    dataSend.investment = undefined;
  
    if (this.form.controls["quotas"].value <= 0) {
      toastr.error("O número de cotas solicitado é inválido. Por favor, insira um valor maior que zero.", "Erro");
    } else if (this.form.controls["quotas"].value > this.quotas - this.quotasSold) {
      toastr.error("O número de cotas solicitado excede o disponível. Por favor, revise e tente novamente.", "Erro");
    } else {
      this.loader = true;
      this.loading = true;
      this.loaderService.load(this.loading);
      this.investmentService.createInvestment(dataSend, this.company, this.rounds)
        .pipe(
          finalize(() => {
            this.loading = false;
            this.loaderService.load(false);
            this.loader = false;
          })
        )
        .subscribe({
          next: (response) => {
            this.form.reset();
            this.sendAutomaticService.sendInvestor(dataSend);
            toastr.success("Investimento realizado com sucesso! Obrigado por investir.", "Sucesso");
            this.router.navigate(["/admin/rounds/assets/list"]);
          },
          error: (error) => {
            let erroMsg = "Ocorreu um erro desconhecido. Por favor, tente novamente.";
            if (error.status === 400) {
              switch (error.error.code) {
                case "ILLEGAL_ARGUMENT":
                  erroMsg = "Erro na solicitação: um ou mais argumentos fornecidos são inválidos.";
                  break;
                case "INVESTOR_PROFILE_VIOLATED":
                  erroMsg = "O valor do investimento excede o valor permitido no seu perfil. Por favor, revise os limites de investimento.";
                  break;
                case "INCOMPLETE_INVESTOR_PROFILE":
                  erroMsg = "Seu cadastro de investidor está incompleto. Complete todas as informações necessárias antes de prosseguir.";
                  break;
                case "INSUFFICIENT_FUNDS":
                  erroMsg = "Você não possui fundos suficientes para realizar este investimento. Verifique seu saldo e tente novamente.";
                  break;
                case "QUOTA_EXCEEDED":
                  erroMsg = "O número de cotas solicitado é maior do que o disponível. Reduza a quantidade e tente novamente.";
                  break;
                default:
                  erroMsg = `Erro inesperado: ${error.error.message || "Verifique os dados e tente novamente."}`;
              }
            }
            toastr.error(erroMsg);
          }
        });
    }
  }  

  public maskModality(sigla: string): string {
    return this.modalityService.getModality(sigla)?.description;
  }

  public maskGuarantee(guarantee: string): string {
    let maskGuarantee = "";
    switch (guarantee) {
      case "T":
        maskGuarantee = "TÍTULO CONVERSÍVEL";
        break;
      case "A":
        maskGuarantee = "AVALISTAS";
        break;
    }
    return maskGuarantee;
  }

  getCaptable() {
    this.captableService
      .getCaptable(this.company)
      .subscribe({
        next: (response) => {
          for (const key in response) {
            if(response[key] > 0 && key != "id"){
              this.captable.data.push((response[key]).toFixed(2));
              this.captable.labels.push(this.getDonuteLabel(key));
              this.captable.colors.push(this.getColor(key));
            }
          }
        }
      });
  }

  getDonuteLabel(label: string){

    const labels = {
      "founders": "Fundadores",
      "coFounders": "Co-fundadores",
      "vesting": "Vesting",
      "accelerator": "Aceleradora",
      "crowdfunding": "CrowdFunding",
      "angel": "Investidor Anjo",
      "venture1": "Venture Capital 1",
      "ventureCapital2": "Venture Capital 2",
      "venture3": "Venture Capital 3",
      "investmentFund1": "Fundo de Investimento 1",
      "investmentFund2": "Fundo de Investimento 2",
      "ventureBuilder1": "Venture Builder 1",
      "ventureBuilder2": "Venture Builder 2",
      "ventureBuilder3": "Venture Builder 3"
    };

    return labels[label] ?? label;

  }

  getColor(label: string){

    const colors = {
      "founders": "#808080",
      "coFounders": "#8497B0",
      "vesting": "#ACB9CA",
      "accelerator": "#C65911",
      "crowdfunding": "#F4B084",
      "angel": "#F8CBAD",
      "venture1": "#548235",
      "ventureCapital2": "#A9D08E",
      "venture3": "#C6E0B4",
      "investmentFund1": "#BF8F00",
      "investmentFund2": "#FFD966",
      "ventureBuilder1": "#2F75B5",
      "ventureBuilder2": "#9BC2E6",
      "ventureBuilder3": "#BDD7EE"
    };

    const color = colors[label];

    if(!color){
      return `#${Math.floor(Math.random()*16777215).toString(16)}`;
    }

    return color;

  }

  formatParticipation(value: number): string {
    const percentage = (value * 100).toFixed(6); 
    return parseFloat(percentage) === 0 ? "<0.000001%" : `${percentage}%`;
  }
  

  randomColors(n: number){
    const colors = [
      "#808080",
      "#B09784",
      "#CAB9AC",
      "#1159C6",
      "#84B0F4",
      "#ADCBF8",
      "#358254",
      "#8ED0A9",
      "#B4E0C6",
      "#008FBF",
      "#66D9FF",
      "#B5752F",
      "#E6C29B",
      "#EED7BD"
    ];

    return colors.slice(0, n);
  }
}
