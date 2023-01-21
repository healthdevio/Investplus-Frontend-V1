import { LoaderService } from './../../../../core/service/loader.service';
import { Component, OnInit } from "@angular/core";
import { RealStateService } from "../../../../core/service/real-state.service";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
} from "@angular/forms";
import { InvestmentService } from "../../../../core/service/investment.service";
import { EventEmitterService } from "../../../../core/service/event-emitter-service.service";
import { SendAutomaticService } from "../../../../core/service/send-automatic.service";
import { Options } from "ng5-slider";
import { CompanyService } from "../../../../core/service/company.service";

declare var $: any;
declare var toastr: any;
declare var bootbox: any;

@Component({
  selector: "app-round-investment-real-state",
  templateUrl: "./round-investment-real-state.component.html",
  styleUrls: ["./round-investment-real-state.component.css"],
})
export class RoundInvestmentRealStateComponent implements OnInit {
  form: FormGroup;
  loader: boolean;
  rounds = 0;
  company = 0;
  quotas = 0;
  quotasSold = 0;
  quotaValue = 0;
  returnTimeInMonths = 0;
  total = 0;
  objective = 0;
  logo = "";
  banner = "";
  investment = 0;
  name = "";
  getRound: any;
  cdi: any;
  value = 1;
  list = [];
  current = 0;
  shortTerm = 0;
  longTerm = 0;
  options: Options = {
    floor: 1,
    ceil: 300,
  };

  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private activedRouter: ActivatedRoute,
    private roundService: RealStateService,
    private investmentService: InvestmentService,
    private router: Router,
    private eventEmitter: EventEmitterService,
    private sendAutomaticService: SendAutomaticService,
    private valuationService: CompanyService,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    this.activedRouter.params.subscribe((params) => {
      this.rounds = params["id"];
    });

    this.initForm();

    this.getCDI();

    const $this = this;
    setTimeout(function () {
      $this.initMask();
    }, 500);

    this.loader = true;
    this.roundService.getRound(this.rounds).subscribe((response) => {
      this.quotasSold = response.resume.quotasSold;
      this.quotas = response.quotas;
      this.quotaValue = response.quotaValue;
      this.logo = response.logo;
      this.banner = response.banner;
      this.total = response.resume.total;
      this.objective = response.quotas * response.quotaValue;
      this.returnTimeInMonths = response.returnTimeInMonths;
      this.name = response.property;
      this.loader = false;
      this.options.ceil = this.quotas - this.quotasSold;
    });
  }

  initForm() {
    this.form = this.formBuilder.group({
      quotas: [null, [Validators.required, this.quotaValidator()]],
      investment: [null],
      publicAccess: [true],
    });
  }

  quotaValidator(): ValidatorFn {
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

  initMask() {
    const SPMaskBehavior = function (val) {
      return val.replace(/\D/g, "").length === 11
        ? "(00) 00000-0000"
        : "(00) 0000-00009";
    },
      spOptions = {
        onKeyPress: function (val, e, field, options) {
          field.mask(SPMaskBehavior.apply({}, arguments), options);
        },
      };
    $(".money").mask("#.##0,00", {
      reverse: true,
    });
    $(".number").keyup(function () {
      $(this).val(this.value.replace(/\D/g, ""));
    });
  }

  makeInvestment() {
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

    const $this = this;
    const dataSend = this.form.value;

    dataSend.investment = undefined;

    if (this.form.controls["quotas"].value <= 0) {
      toastr.error("O número de cotas solicitado é inválido.", "Erro");
    } else if (
      this.form.controls["quotas"].value >
      this.quotas - this.quotasSold
    ) {
      toastr.error(
        "O número de cotas solicitado é maior do que o disponível.",
        "Erro"
      );
    } else {

      this.loading = true;
      this.loaderService.load(this.loading);
      this.investmentService
        .createInvestmentRealState(dataSend, this.rounds)
        .subscribe(
          (response) => {
            $this.form.reset();
            $this.sendAutomaticService.sendInvestor(dataSend);
            toastr.success("Investimento realizado!");
            this.router.navigate(["/admin/rounds/incorporator/list"]);
          },
          (error) => {
            let erro = "Ocorreu um erro, entre em contato com o administrador.";
            if ((error.code = 400)) {
              switch (error.error.code) {
                case "ILLEGAL_ARGUMENT":
                  erro = "Ocorreu um erro na solicitação.";
                  break;
                case "INVESTOR_PROFILE_VIOLATED":
                  erro =
                    "O valor do investimento ultrapassa o valor declarado no cadastro.";
                  break;
                case "INCOMPLETE_INVESTOR_PROFILE":
                  erro = "O seu cadastro de investidor está incompleto.";
                  break;
              }
            }
            toastr.error(erro, "Erro");
          }, () => {
            this.loading = false;
            this.loaderService.load(this.loading);
          }
        );
    }
  }

  onSubmit() {
    const $this = this;

    bootbox.confirm({
      title: "Confirmação",
      message:
        "Você confirma o investimento de " +
        this.form.controls["quotas"].value +
        " cota(s) no valor de " +
        this.maskMoney(this.value * this.quotaValue) +
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

  unmaskInput(input) {
    return input.replace(/[^\d]+/g, "");
  }

  maskMoney(number) {
    return number
      .toFixed(2)
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
  }

  updateForm() {
    this.roundService.getRound(this.rounds).subscribe((response) => {
      this.quotasSold = response.resume.quotasSold;
      this.quotas = response.quotas;
      this.quotaValue = response.quotaValue;
      this.logo = response.logo;
      this.banner = response.banner;
      this.total = response.resume.total;
      this.objective = response.quotas * response.quotaValue;
      this.returnTimeInMonths = response.returnTimeInMonths;
      this.name = response.property;
    });
  }

  getCDI() {
    // this.valuationService.getValuation(this.company).subscribe((responseGetValuation) => {

    //   this.list = [
    //     responseGetValuation.current,
    //     responseGetValuation.shortTerm,
    //     responseGetValuation.longTerm
    //   ];
    //   this.valuation = responseGetValuation;

    // });

    this.current = 5.5;
    this.shortTerm = 120;
    this.longTerm = 180;
  }
}
