import { Component, OnDestroy, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { InvestorService } from "../../../core/service/investor.service";
import { TitleHeader } from "../../../core/interface/title-header";
import { TitleService } from "../../../core/service/title.service";
import { forkJoin, Subject, Subscription } from "rxjs";
import { finalize, takeUntil } from "rxjs/operators";
import { Investment } from "../../../core/interface/investment";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { InvestmentInstallmentService } from "../../../core/service/investment-installment.service";
import { BsLocaleService } from "ngx-bootstrap/datepicker";
import { ActivatedRoute, Router } from "@angular/router";

declare var moment: any;

@Component({
  selector: "app-admin-user-statement",
  templateUrl: "./admin-user-statement.component.html",
  styleUrls: ["./admin-user-statement.component.css"],
})
export class AdminUserStatementComponent implements OnInit, OnDestroy {

  titleHeader: TitleHeader;
  destroy$ = new Subject();
  investments: Investment[] = []
  contracts!: any[];
  modalRef?: BsModalRef;
  contratosLoading: boolean ;
  loader: boolean;

  investmentInstallments: any[];
  investmentInstallmentsLoading: boolean;

  p = 1;
  responsive = true;
  labels: any = {
      previousLabel: 'Anterior',
      nextLabel: 'Próximo'
  };
  textRegister = 'Nenhum registro encontrado.';

  form: FormGroup;
  subscription$: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private investorService: InvestorService,
    private modalService: BsModalService,
    private data: TitleService,
    private investmentInstallmentService: InvestmentInstallmentService,
    private bsLocaleService: BsLocaleService,
    private activatedRoute: ActivatedRoute,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.bsLocaleService.use('pt-br')
    this.createForm();
    this.setTitle();
    this.onActivatedRoute();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscription$?.unsubscribe();
  }

  onActivatedRoute() {
    this.subscription$ = this.activatedRoute.queryParams.subscribe({
      next: (response) => {
        this.form.patchValue(this.castParamsToForm(response));
        this.getInvestments(this.getParams());
      }
    })
  }

  onFilter(){
    this.router.navigate([], {
      queryParams: this.getParams(),
      relativeTo: this.activatedRoute
    })
  }

  setTitle() {
    this.data.currentMessage.subscribe(titles => this.titleHeader = titles);
    this.titleHeader.title = 'Administração / Extrato Financeiro';
    this.data.changeTitle(this.titleHeader);
  }

  createForm() {
    this.form = this.formBuilder.group({
      companyName: [],
      dataInicial: [new Date],
      dataFinal: [new Date],
    })
  }

  getParams() {
    const _obj = this.form.value;
    const _params = {};
    for (const key in _obj) {
      if(_obj[key]){
        if(_obj[key] instanceof Date){
          const d: Date = _obj[key];
          _params[key] = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        }else{
          _params[key] = _obj[key];
        }
      }
    }
    return _params;
  }

  castParamsToForm(object = {}){
    const _params = {};
    for (const key in object) {
      _params[key] =  /\d{4}-\d{2}-\d{2}/.test(object[key]) ? new Date(object[key].split("-")) : object[key];
    }
    return _params;
  }

  getInvestments(params?: any) {
    this.loader = true;
    this.investorService
      .getInvestments(params)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loader = false;
        })
      )
      .subscribe({
        next: (investments) => {
          this.investments = investments;
        }
      })
  }

  async getContracts(contracts: any[]){

    this.contratosLoading = true;

    const requests = contracts.map(contract => {
      return this.investorService .getContract(contract?.externalId)
    })

    forkJoin(requests)
      .pipe( takeUntil(this.destroy$), finalize(() => this.contratosLoading = false))
      .subscribe({
        next: (_contracts) => {
          this.contracts = [];
          _contracts.forEach((contract, index) => {
            this.contracts.push({
              name: contract?.document?.filename,
              download: contract?.document?.downloads?.signed_file_url ?? contract?.document?.downloads?.original_file_url,
              sign: contracts[index]['url'],
              status: contracts[index]['status'],
            })
          });
        },
        error: (error) => {
          console.log(error);
        }
      })
  }

  getInstallments(investment: number) {
    this.investmentInstallmentsLoading = true;
    this.investmentInstallmentService
      .getInstallments(investment)
      .pipe(
        finalize(() => {
          this.investmentInstallmentsLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.investmentInstallments = response;
        },
        error: (error) => {
          this.investmentInstallments = [];
          console.log(error);
        }
      })
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  /* form: FormGroup;
  titleHeader: TitleHeader;
  loader: boolean;
  textRegister = 'Nenhum registro encontrado.';
  p = 1;
  q = 1;
  responsive = true;
  labels: any = {
    previousLabel: 'Anterior',
    nextLabel: 'Próximo'
  };
  incommings = [];
  dataInstallments: any;
  dataInstallmentsFilter: any;
  firstDay: any;
  lastDay: any;

  sumInstallments = 0;
  sumInstallmentsIr = 0;
  sumInstallmentsCost = 0;
  sumInstallmentsLiquid = 0;

  dataInstallment = [];
  optionsInstallment: any;

  constructor(private investorService: InvestorService,
    private formBuilder: FormBuilder,
    private data: TitleService,
    private dateMask: DateMaskPipe
    ) {}

  ngOnInit() {

    this.data.currentMessage.subscribe(titles => this.titleHeader = titles);
    this.titleHeader.title = 'Meu Perfil / Extrato Financeiro';
    this.data.changeTitle(this.titleHeader);
    this.firstDay = moment().subtract(1, 'months').format('01/MM/YYYY');
    this.lastDay = moment().add(72, 'months').format('DD/MM/YYYY');
    this.getUserInstallments();
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      initialDate: [this.firstDay],
      finalDate: [this.lastDay]
    });
  }

  private getUserInstallments(): void {
    this.loader = true;
    this.investorService.getUser().subscribe(
      (response) => {
        this.dataInstallments = response.investmentsInstallments;

        if (this.dataInstallments != null) {

          this.dataInstallments.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          });

          this.dataInstallmentsFilter = this.dataInstallments;

          for (let i = 0; i < this.dataInstallmentsFilter.length; i++) {

            if (this.dataInstallmentsFilter[i].status === 'PENDING') {
              this.sumInstallments += this.dataInstallmentsFilter[i].profitValue;
              this.sumInstallmentsIr += (this.dataInstallmentsFilter[i].profitValue * (1 - this.dataInstallmentsFilter[i].percentageCost)) * this.dataInstallmentsFilter[i].percentageIr / 100;
              this.sumInstallmentsCost += (this.dataInstallmentsFilter[i].profitValue - (this.dataInstallmentsFilter[i].profitValue * (1 - this.dataInstallmentsFilter[i].percentageCost)));
              this.sumInstallmentsLiquid += (this.dataInstallmentsFilter[i].profitValue * (1 - this.dataInstallmentsFilter[i].percentageCost)) - ((this.dataInstallmentsFilter[i].profitValue * (1 - this.dataInstallmentsFilter[i].percentageCost)) * this.dataInstallmentsFilter[i].percentageIr / 100);
            }
          }

          this.dataInstallment = [100, 0];
          this.optionsInstallment = {
            legend: {
              display: false
            },
            animation: {
              duration: 4000,
            },
            cutoutPercentage: 95
          };

        }

        this.filterInvestment();
        const $this = this;
        setTimeout(function () {
          $this.initMask();
        }, 2000);
        this.loader = false;
      });
  }

  initMask() {
    const SPMaskBehavior = function (val) {
        return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
      },
      spOptions = {
        onKeyPress: function (val, e, field, options) {
          field.mask(SPMaskBehavior.apply({}, arguments), options);
        }
      };
    $('.phone').mask(SPMaskBehavior, spOptions);
    $('.zipCode').mask('00000-000');
    $('.cpf').mask('000.000.000-00');
    $('.dateOfInvestment').mask('00/00/0000');
    $('.money').mask('#.##0,00', {
      reverse: true
    });
  }

  public maskStatus(status: string): string {
    let formatedStatus = '';
    switch (status) {
      case 'PENDING':
        formatedStatus = 'PENDENTE';
        break;
      case 'CONFIRMED':
        formatedStatus = 'CONFIRMADO';
        break;
    }
    return formatedStatus;
  }

  public maskSigned(date: any): string {
    return date == null ? '------' : this.dateMask.transform(date);
  }

  public maskModel(model: string): string {
    const aux = TiposModalidades[model];
    if (!aux) {
      return ""
    }

    return aux;
  }

  public filterInvestment() {

    if (this.dataInstallments != null) {
      let initialDate = this.form.controls['initialDate'].value;
      let finalDate = this.form.controls['finalDate'].value;

      if (this.validateDate(initialDate) && this.validateDate(finalDate)) {

        initialDate = new Date(this.dateMask.transform(this.form.controls['initialDate'].value, 'AMERICAN'));
        finalDate = new Date(this.dateMask.transform(this.form.controls['finalDate'].value, 'AMERICAN'));

        this.dataInstallmentsFilter = this.dataInstallments.filter(function (a) {
          const aDate = new Date(a.dueDate);
          return aDate >= initialDate && aDate <= finalDate;
        });

        this.sumInstallments = 0;
        this.sumInstallmentsIr = 0;
        this.sumInstallmentsCost = 0;
        this.sumInstallmentsLiquid = 0;

        for (let i = 0; i < this.dataInstallmentsFilter.length; i++) {

          if (this.dataInstallmentsFilter[i].status === 'PENDING') {
            this.sumInstallments += this.dataInstallmentsFilter[i].profitValue;
            this.sumInstallmentsIr += (this.dataInstallmentsFilter[i].profitValue * (1 - this.dataInstallmentsFilter[i].percentageCost)) * this.dataInstallmentsFilter[i].percentageIr / 100;
            this.sumInstallmentsCost += (this.dataInstallmentsFilter[i].profitValue - (this.dataInstallmentsFilter[i].profitValue * (1 - this.dataInstallmentsFilter[i].percentageCost)));
            this.sumInstallmentsLiquid += (this.dataInstallmentsFilter[i].profitValue * (1 - this.dataInstallmentsFilter[i].percentageCost)) - ((this.dataInstallmentsFilter[i].profitValue * (1 - this.dataInstallmentsFilter[i].percentageCost)) * this.dataInstallmentsFilter[i].percentageIr / 100);
          }
        }
      }
    }
  }

  public clearInitial(): void {
    this.form.controls['initialDate'].setValue('');
  }

  public clearFinal(): void {
    this.form.controls['finalDate'].setValue('');
  }

  private validateDate(input: string): boolean {
    const date = input;
    let ardt = new Array;
    const ExpReg = new RegExp('(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/[12][0-9]{3}');
    ardt = date.split('/');
    let erro = false;
    if (date.search(ExpReg) === -1) {
      erro = true;
    } else if (((ardt[1] === 4) || (ardt[1] === 6) || (ardt[1] === 9) || (ardt[1] === 11)) && (ardt[0] > 30)) {
      erro = true;
    } else if (ardt[1] === 2) {
      if ((ardt[0] > 28) && ((ardt[2] % 4) !== 0)) {
        erro = true;
      }
      if ((ardt[0] > 29) && ((ardt[2] % 4) === 0)) {
        erro = true;
      }
    }
    if (erro) {
      return false;
    }
    return true;
  } */
}
