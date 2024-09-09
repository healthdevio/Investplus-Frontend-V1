import { Component, OnInit } from "@angular/core";
import { InvestorService } from "../../../core/service/investor.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { TitleHeader } from "../../../core/interface/title-header";
import { TitleService } from "../../../core/service/title.service";
import { RoundService } from "../../../core/service/round.service";

declare var moment: any;

@Component({
  selector: "app-admin-user-portfolio",
  templateUrl: "./admin-user-portfolio.component.html",
  styleUrls: ["./admin-user-portfolio.component.css"],
})
export class AdminUserPortfolioComponent implements OnInit {
  form: FormGroup;
  titleHeader: TitleHeader;
  loader: boolean;
  portfolio: boolean;
  yieldLabel = "PRÉ FIXADO";
  currentDate: string; 
  rounds: any;
  upangel: any;
  upimob: any;
  installments: any;
  dataCompany = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  sumCompany = 0;
  percentCompany = 0;
  dataStartup = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  sumStartup = 0;
  percentStartup = 0;
  dataReal = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  sumReal = 0;
  percentReal = 0;
  dataPie = [];
  optionsPie: any;
  optionsResume: any;
  optionsBar: any;
  dataBar: any;
  datas = [];
  companies: any;
  companiesQuota: any;
  companiesValue: any;

  sumQuarterlyPaid = 0;
  sumAnnualyPaid = 0;
  sumTotalPaid = 0;

  sumQuarterlyOpen = 0;
  sumAnnualyOpen = 0;
  sumTotalOpen = 0;

  sumQuarterlyProjected = 0;
  sumAnnualyProjected = 0;
  sumTotalProjected = 0;

  now: any;
  yearNow: any;
  monthNow: any;
  quarterNow: any;

  isSheetOpen = false;

  cards = [
    {
      title: 'Patrimônio total',
      value: 'R$ 000',
      backgroundColor: 'white',
      showSvg: true
    },
    {
      title: 'Total investido - Outras Plataformas',
      value: 'R$ 000',
      backgroundColor: 'white',
      showSvg: true
    },
    {
      title: 'Total Investido - Investplus',
      value: 'R$ 000',
      backgroundColor: 'white',
      showSvg: true
    }
    // {
    //   title: '',
    //   value: '',
    //   backgroundColor: '#00000014',
    //   showSvg: false
    // }
  ];

  investsData = [
    {
      title: 'Startup 1',
      date: '31/10/2000',
      participation: '40',
      valuation: 'R$ 10.000,00',
    },
    {
      title: 'Startup 2',
      date: '31/10/2000',
      participation: '40',
      valuation: 'R$ 10.000,00',
    },
    {
      title: 'Startup 3',
      date: '31/10/2000',
      participation: '40',
      valuation: 'R$ 10.000,00',
    },
  ]

  transactionsData = [
    {
      type: 'Investimento',
      value: 'R$ 10.000,00',
      date: '31/10/2000',
    },
    {
      type: 'Investimento',
      value: 'R$ 10.000,00',
      date: '31/10/2000',
    },
    {
      type: 'Investimento',
      value: 'R$ 10.000,00',
      date: '31/10/2000',
    },
    {
      type: 'Investimento',
      value: 'R$ 10.000,00',
      date: '31/10/2000',
    },
    {
      type: 'Investimento',
      value: 'R$ 10.000,00',
      date: '31/10/2000',
    },
  ]

  sheetData = [
    {
      title: 'Custo de aquisição de cliente',
      subTittle: 'CAC',
      value: 'R$ 10.000,00',
    },
    {
      title: 'Valor do ciclo de vida do cliente',
      subTittle: 'LTV',
      value: 'R$ 5,000.00',
    },
    {
      title: 'Receita recorrente mensal',
      subTittle: 'MRR',
      value: 'R$ 2,000.00',
    },
    {
      title: 'Taxa de Churn',
      subTittle: '-',
      value: 'R$ 1,000.00',
    },
    {
      title: 'Taxa de retenção de cliente',
      subTittle: '-',
      value: 'R$ 1,000.00',
    },
    {
      title: 'Taxa de crescimento de receita',
      subTittle: '-',
      value: 'R$2,000.00',
    },
    {
      title: 'Margem bruta',
      subTittle: '-',
      value: 'R$ 1,000.00',
    },
    {
      title: 'Pista de caixa',
      subTittle: 'Cash runway',
      value: 'R$ 10,000.00',
    },
  ]

  valuationProjected = {
    company: "FCJ Invest",
    logo: "./../../../assets/img/logo_upangel.png",
    value: 0,
    deadline: 0,
    total: 0,
    percentValue: 0,
    percentCdi: 0,
    percentAnnual: 0,
  };
  valuationGuaranteed = {
    total: 0,
    percentValue: 0,
    percentCdi: 0,
    percentAnnual: 0,
  };

  constructor(
    private investorService: InvestorService,
    private roundService: RoundService,
    private formBuilder: FormBuilder,
    private data: TitleService
  ) {}

  ngOnInit() {
    this.data.currentMessage.subscribe((titles) => (this.titleHeader = titles));
    this.titleHeader.title = "Meu Perfil / Análise da Carteira";
    this.data.changeTitle(this.titleHeader);
    this.getUserInvestments();

    this.currentDate = this.formatCurrentDate();
  }

  private formatCurrentDate(): string {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    return date.toLocaleDateString('pt-BR', options);
  }

  openSheet(): void {
    this.isSheetOpen = true;
  }

  closeSheet(): void {
    const sheet = document.querySelector('.sideSheet');
    if (sheet) {
      sheet.classList.add('hidden');
      setTimeout(() => {
        this.isSheetOpen = false;
        sheet.classList.remove('hidden');
      }, 300);
    }
  }

  private getUserInvestments(): void {
    this.loader = true;
    this.portfolio = false;

    this.investorService.getUser().subscribe((response) => {
      // Obter investimentos Upangel e Imobiliário
      this.upangel = response.companyInvestments;
      this.upimob = response.realStateInvestments;
      this.installments = response.investmentsInstallments;

      // Soma todos os valores encontrados em companyInvestments
      const totalInvestedInvestplus = this.upangel
        .map(investment => investment.value)
        .reduce((acc, value) => acc + value, 0);

      // Obter valor de totalInvestedOthers
      const totalInvestedOthers = response.totalInvestedOthers || 0;

      // Atualizar os valores dos cards com as somas necessárias
      this.cards[1].value = `R$ ${totalInvestedOthers.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
      this.cards[2].value = `R$ ${totalInvestedInvestplus.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

      const patrimonioTotal = totalInvestedOthers + totalInvestedInvestplus;
      this.cards[0].value = `R$ ${patrimonioTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

      this.datas = this.dateResume(new Date());
      this.setResumeInvestments();
      this.setGraphPie();
      this.setGraphBar();
      this.setResumeInstallments(0);
      this.getRounds();
    });
  }

  private getRounds(): void {
    this.roundService.getAllShortUser().subscribe((responseRound) => {
      this.rounds = responseRound.companiesRounds;
      this.loader = false;
    });
  }

  private setResumeInstallments(company: number): void {
    if (this.installments != null) {
      let installmentsCompany = this.installments;

      this.sumQuarterlyPaid = 0;
      this.sumAnnualyPaid = 0;
      this.sumTotalPaid = 0;

      this.sumQuarterlyOpen = 0;
      this.sumAnnualyOpen = 0;
      this.sumTotalOpen = 0;

      this.sumQuarterlyProjected = 0;
      this.sumAnnualyProjected = 0;
      this.sumTotalProjected = 0;

      if (company > 0) {
        installmentsCompany = this.installments;
      }

      this.now = moment();
      this.yearNow = this.now.year();
      this.monthNow = this.now.month();
      this.quarterNow = Math.trunc(this.monthNow / 3 + 1);

      for (const value of installmentsCompany) {
        const dateInstallment = moment(value.dueDate);
        const yearInstallment = dateInstallment.year();
        const monthInstallment = dateInstallment.month();
        const quarterInstallment = Math.trunc(monthInstallment / 3 + 1);

        if (value.status === "PAID") {
          if (this.quarterNow === quarterInstallment) {
            this.sumQuarterlyPaid +=
              value.profitValue * (1 - value.percentageCost) -
              value.profitValue *
                (1 - value.percentageCost) *
                (value.percentageIr / 100);
          }
          if (
            this.yearNow === yearInstallment &&
            this.yearNow === yearInstallment
          ) {
            this.sumAnnualyPaid +=
              value.profitValue * (1 - value.percentageCost) -
              value.profitValue *
                (1 - value.percentageCost) *
                (value.percentageIr / 100);
          }
          this.sumTotalPaid +=
            value.profitValue * (1 - value.percentageCost) -
            value.profitValue *
              (1 - value.percentageCost) *
              (value.percentageIr / 100);
        }

        if (value.status === "PENDING" && dateInstallment < this.now) {
          if (
            this.quarterNow === quarterInstallment &&
            this.yearNow === yearInstallment
          ) {
            this.sumQuarterlyOpen +=
              value.profitValue * (1 - value.percentageCost) -
              value.profitValue *
                (1 - value.percentageCost) *
                (value.percentageIr / 100);
          }
          if (this.yearNow === yearInstallment) {
            this.sumAnnualyOpen +=
              value.profitValue * (1 - value.percentageCost) -
              value.profitValue *
                (1 - value.percentageCost) *
                (value.percentageIr / 100);
          }
          this.sumTotalOpen +=
            value.profitValue * (1 - value.percentageCost) -
            value.profitValue *
              (1 - value.percentageCost) *
              (value.percentageIr / 100);
        }

        if (value.status === "PENDING" && dateInstallment >= this.now) {
          if (
            this.quarterNow === quarterInstallment &&
            this.yearNow === yearInstallment
          ) {
            this.sumQuarterlyProjected +=
              value.profitValue * (1 - value.percentageCost) -
              value.profitValue *
                (1 - value.percentageCost) *
                (value.percentageIr / 100);
          }
          if (this.yearNow === yearInstallment) {
            this.sumAnnualyProjected +=
              value.profitValue * (1 - value.percentageCost) -
              value.profitValue *
                (1 - value.percentageCost) *
                (value.percentageIr / 100);
          }
          this.sumTotalProjected +=
            value.profitValue * (1 - value.percentageCost) -
            value.profitValue *
              (1 - value.percentageCost) *
              (value.percentageIr / 100);
        }
      }
    }
  }

  private setResumeInvestments(): void {
    if (this.upangel != null) {
      const months = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ];

      for (const value of this.upangel) {
        const dateFinal = new Date(value.date);
        dateFinal.setDate(dateFinal.getDate() + 1);

        const dataInvestment =
          months[dateFinal.getMonth()] +
          "/" +
          dateFinal.getFullYear().toString().substring(2, 4);
        const pos = this.datas.lastIndexOf(dataInvestment);

        if (value.model === "TRADITIONAL") {
          // Empresa

          this.sumCompany += value.value;

          if (pos >= 0) {
            this.dataCompany[pos] = this.dataCompany[pos] + value.value;
          }
        } else {
          // Startup

          this.sumStartup += value.value;

          if (pos >= 0) {
            this.dataStartup[pos] = this.dataStartup[pos] + value.value;
          }
        }
      }

      for (const value of this.upimob) {
        // Imobiliário
        this.sumReal += value.value;

        const dateFinal = new Date(value.date);
        dateFinal.setDate(dateFinal.getDate() + 1);

        const dataInvestment =
          months[dateFinal.getMonth()] +
          "/" +
          dateFinal.getFullYear().toString().substring(2, 4);
        const pos = this.datas.lastIndexOf(dataInvestment);

        if (pos >= 0) {
          this.dataReal[pos] = this.dataReal[pos] + value.value;
        }
      }

      this.companies = this.upangel.reduce((acc, val) => {
        if (!acc.find((el) => el.companyId === val.companyId)) {
          acc.push(val);
        }
        return acc;
      }, []);

      this.companiesValue = this.reducer(this.upangel, "companyId", "value");
      this.companiesQuota = this.reducer(this.upangel, "companyId", "quotas");

      for (let i = 0; i < this.companies.length; i++) {
        this.companiesValue.map((x) => {
          if (x.companyId === this.companies[i].companyId) {
            this.companies[i].value = x.value;
          }
        });

        this.companiesQuota.map((x) => {
          if (x.companyId === this.companies[i].companyId) {
            this.companies[i].quotas = x.quotas;
          }
        });
      }
    }
  }

  private setGraphPie(): void {
    this.optionsPie = {
      legend: {
        display: false,
      },
      animation: {
        duration: 2000,
      },
      cutoutPercentage: 93,
    };

    if (this.upangel != null) {
      this.percentCompany =
        (this.sumCompany / (this.sumStartup + this.sumReal + this.sumCompany)) *
        100;
      this.percentStartup =
        (this.sumStartup / (this.sumStartup + this.sumReal + this.sumCompany)) *
        100;
      this.percentReal =
        (this.sumReal / (this.sumStartup + this.sumReal + this.sumCompany)) *
        100;
      this.dataPie = [
        this.percentStartup.toFixed(2),
        this.percentReal.toFixed(2),
        this.percentCompany.toFixed(2),
      ];

      this.optionsPie = {
        legend: {
          display: false,
        },
        animation: {
          duration: 2000,
        },
        cutoutPercentage: 93,
      };
    }
  }

  private setGraphBar(): void {
    if (this.upangel != null) {
      this.dataBar = {
        labels: this.datas,
        datasets: [
          {
            label: "Startup",
            backgroundColor: "#0cb8b6",
            data: this.dataStartup,
          },
          {
            label: "Imobiliário",
            backgroundColor: "#8c2e5b",
            data: this.dataReal,
          },
          {
            label: "Empresa",
            backgroundColor: "#2e7e89",
            data: this.dataCompany,
          },
        ],
      };

      this.optionsBar = {
        title: {
          display: false,
          text: "",
        },
        animation: {
          duration: 4000,
        },
        legend: {
          display: false,
        },
        tooltips: {
          mode: "index",
          intersect: false,
          callbacks: {
            label: function (t, d) {
              const xLabel = d.datasets[t.datasetIndex].label;
              const yLabel = t.yLabel;
              return (
                "" +
                yLabel
                  .toFixed(2)
                  .replace(".", ",")
                  .replace(/(\d)(?=(\d{3})+\,)/g, "$1.")
              );
            },
          },
        },
        responsive: true,
        scales: {
          xAxes: [
            {
              stacked: true,
              ticks: {
                fontSize: 12,
              },
            },
          ],
          yAxes: [
            {
              stacked: true,
              ticks: {
                fontSize: 12,
                beginAtZero: true,
                callback: (value, index, values) => {
                  return (
                    "" +
                    value
                      .toFixed(2)
                      .replace(".", ",")
                      .replace(/(\d)(?=(\d{3})+\,)/g, "$1.")
                  );
                },
              },
            },
          ],
        },
      };
    }
  }

  public lastMonth(date, diff): any {
    const d = new Date(date);
    d.setMonth(d.getMonth() + diff);
    return d;
  }

  public dateResume(data): any {
    const datas = [];
    const months = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];
    for (let i = 0; i < 12; i++) {
      const formatted_date =
        months[this.lastMonth(data, i * -1).getMonth()] +
        "/" +
        this.lastMonth(data, i * -1)
          .getFullYear()
          .toString()
          .substring(2, 4);
      datas.push(formatted_date);
    }
    return datas.reverse();
  }

  private reducer(data: any, groupBy: string, reduceValue: string): any {
    // Reduz os dados e inicializa com um objeto vazio
    return [].concat
      .apply(
        data.reduce(function (hash, current) {
          // Se o hash obtiver a chave atual, recupera e adiciona a propriedade sum
          hash[current[groupBy]] =
            (hash[current[groupBy]] || 0) + current[reduceValue];
          // Retorna o hash atual
          return hash;
        }, {})
      )
      .map(function (elm) {
        // Recupera chaves de objeto
        return Object.keys(elm).map(function (key) {
          // Construção do objeto
          const obj = {};
          obj[groupBy] = +key;
          obj[reduceValue] = elm[key];
          return obj;
        });
      })[0];
  }

  public activePortfolio(company: number) {
    this.setResumeInstallments(company);

    if (company === 0) {
      this.portfolio = false;
    } else {
      this.portfolio = true;

      this.companies.map((x) => {
        if (x.companyId === company) {
          this.valuationProjected.company = x.company;
          this.valuationProjected.logo = x.logo;
          this.valuationProjected.value = x.value;
        }
      });

      this.rounds.map((x) => {
        if (x.id === company) {
          this.valuationProjected.deadline = this.nvl(x.round.deadline, 0);
          this.valuationProjected.total =
            this.valuationProjected.value *
            (1 + this.nvl(x.round.valuation, 0) / 100);
          this.valuationProjected.percentValue =
            (this.valuationProjected.total / this.valuationProjected.value -
              1) *
            100;
          this.valuationProjected.percentCdi =
            (this.valuationProjected.percentValue /
              this.nvl(x.round.cdiValue, 1)) *
            100;
          this.valuationProjected.percentAnnual =
            this.valuationProjected.percentValue /
            this.nvl(x.round.deadline, 1);
          this.valuationGuaranteed.total =
            (((this.nvl(x.round.percentageOfIncome, 0) / 100) *
              this.nvl(x.round.cdiValue, 0)) /
              100) *
              this.nvl(x.round.deadline, 0) *
              this.valuationProjected.value +
            this.valuationProjected.value;
          this.valuationGuaranteed.percentValue =
            (this.valuationGuaranteed.total / this.valuationProjected.value -
              1) *
            100;
          this.valuationGuaranteed.percentCdi =
            (this.valuationGuaranteed.percentValue /
              this.nvl(x.round.cdiValue, 1)) *
            100;
          this.valuationGuaranteed.percentAnnual =
            this.valuationGuaranteed.percentValue /
            this.nvl(x.round.deadline, 1);
        }
      });
    }
  }

  public nvl(input: any, replace: any): any {
    return input == null ? replace : input;
  }
}
