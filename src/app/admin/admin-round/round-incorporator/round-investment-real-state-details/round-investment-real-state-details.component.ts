import { LoaderService } from './../../../../core/service/loader.service';
import { DateMaskPipe } from './../../../../core/pipes/date-mask.pipe';
import { MoneyMaskPipe } from './../../../../core/pipes/money-mask.pipe';
import { Component, OnInit, SecurityContext } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RealStateService } from "../../../../core/service/real-state.service";
import { Round } from "../../../../core/interface/round";
import { Router } from "@angular/router";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { InvestorService } from "../../../../core/service/investor.service";
import { Forum } from "../../../../core/interface/forum";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
  FormControl,
} from "@angular/forms";
import { InvestmentService } from "../../../../core/service/investment.service";
import { SendAutomaticService } from "../../../../core/service/send-automatic.service";
import { Investor } from "../../../../core/interface/investor";
import { Options } from "ng5-slider";

declare var $: any;
declare var bootbox: any;
declare var toastr: any;
declare var moment: any;

@Component({
  selector: "app-round-investment-real-state-details",
  templateUrl: "./round-investment-real-state-details.component.html",
  styleUrls: ["./round-investment-real-state-details.component.css"],
})
export class RoundInvestmentRealStateDetailsComponent implements OnInit {
  form: FormGroup;
  formComment: FormGroup;
  round: Round;
  posts: Forum;
  response: any;
  investments: any;
  executives: any;
  property: string;
  builder: string;
  logo = "";
  logoDocUrl: string;
  annualMaxProfitability = "";
  annualMinProfitability = "";
  minimalProfitability = "";
  projectedMaxProfitability = "";
  projectedMinProfitability = "";
  returnTimeInMonths: number;
  description: string;
  location: string;
  locationLink: SafeResourceUrl;
  roundDoc: string;
  builderDoc: string;
  propertyDoc: string;
  viabilityDoc: string;
  taxationDoc: string;
  legalDoc: string;
  roundDocUrl: string;
  docInvestmentContract: string;
  builderDocUrl: string;
  propertyDocUrl: string;
  viabilityDocUrl: string;
  taxationDocUrl: string;
  legalDocUrl: string;
  totalApartments: number;
  availableApartments: number;
  business = "";
  achievements = "";
  riskiness = "";
  executiveTeam: any;
  quotas = 0;
  quotasSold = 0;
  minimalQuotas = "";
  duration = 0;
  quotaValue = 0;
  total = "";
  status = "";
  offerVideo: SafeResourceUrl;
  rounds = 0;
  porcent = "";
  loader: boolean;
  loading: boolean = false;
  banner = "";
  investors: Investor;
  newPost = false;
  startedAt: any;
  finishAt: any;
  id: number;

  current = 0;
  shortTerm = 0;
  longTerm = 0;
  dataResume = [];
  dataApartments = [];
  optionsResume: any;
  amountQuota = 1;
  options: Options = {
    floor: 1,
    ceil: 300,
  };

  constructor(
    private activedRouter: ActivatedRoute,
    private roundService: RealStateService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private investorService: InvestorService,
    private formBuilder: FormBuilder,
    private sendAutomaticService: SendAutomaticService,
    private investmentService: InvestmentService,
    private maskMoney: MoneyMaskPipe,
    private dateMask: DateMaskPipe,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    this.getUser();

    this.initForm();

    this.getCDI();

    this.activedRouter.params.subscribe((params) => {
      this.rounds = params["id"];
    });

    this.loader = true;

    this.roundService.getRound(this.rounds).subscribe((response) => {
      this.response = response;
      console.log('respoonse', response);
      this.loader = false;
      this.investments = response.investments;
      this.property = response.property;
      this.builder = response.builder;
      this.offerVideo = this.getEmbeddedVideoUrl(this.sanitizer.bypassSecurityTrustResourceUrl(response.offerVideo));
      this.logo = response.logo;
      this.logoDocUrl = response.logoDocUrl;
      this.id = response.id;
      this.banner =
        "" +
        response.banner.substring(0, response.banner.indexOf(".jpg")) +
        "_round.jpg";
      this.duration = response.duration;
      this.annualMaxProfitability = this.maskMoney.transform(
        response.annualMaxProfitability
      );
      this.annualMinProfitability = this.maskMoney.transform(
        response.annualMinProfitability
      );
      this.minimalProfitability = this.maskMoney.transform(response.minimalProfitability);
      this.projectedMaxProfitability = this.maskMoney.transform(
        response.projectedMaxProfitability
      );
      this.projectedMinProfitability = this.maskMoney.transform(
        response.projectedMinProfitability
      );
      this.returnTimeInMonths = response.returnTimeInMonths;
      this.description = response.description;
      this.business = response.business;
      this.achievements = response.achievements;
      this.riskiness = response.riskiness;
      this.location = response.location;
      this.locationLink = this.sanitizer.bypassSecurityTrustResourceUrl(
        response.locationLink
      );
      this.roundDoc = response.roundDoc;
      this.builderDoc = response.builderDoc;
      this.propertyDoc = response.propertyDoc;
      this.viabilityDoc = response.viabilityDoc;
      this.taxationDoc = response.taxationDoc;
      this.legalDoc = response.legalDoc;
      this.roundDocUrl = response.roundDocUrl;
      this.builderDocUrl = response.builderDocUrl;
      this.propertyDocUrl = response.propertyDocUrl;
      this.viabilityDocUrl = response.viabilityDocUrl;
      this.taxationDocUrl = response.taxationDocUrl;
      this.legalDocUrl = response.legalDocUrl;
      this.totalApartments = response.totalApartments;
      this.availableApartments = response.availableApartments;
      this.quotaValue = response.quotaValue;
      this.quotas = response.quotas;
      this.executiveTeam = response.executiveTeam;
      this.total = this.maskMoney.transform(response.resume.total);
      this.quotasSold = response.resume.quotasSold;
      this.minimalQuotas = this.maskMoney.transform((this.quotas * this.quotaValue) * 0.66)
      this.status = response.status;
      this.porcent =
        Number(
          (
            (response.resume.total / (response.quotas * response.quotaValue)) *
            100
          ).toFixed(0)
        ) + "%";
      this.posts = response.posts;
      this.startedAt = this.dateMask.transform(response.startedAt);
      this.finishAt = moment(this.startedAt, "DD-MM-YYYY")
        .add("days", this.duration)
        .format("DD/MM/YYYY");
      this.roundDoc = response.roundDoc;
      this.options.ceil = this.quotas - this.quotasSold;

      this.dataApartments = [
        ((this.availableApartments / this.totalApartments) * 100).toFixed(2),
        (100 - (this.availableApartments / this.totalApartments) * 100).toFixed(
          2
        ),
      ];
      this.dataResume = [
        (
          100 -
          (response.resume.total / (response.quotas * response.quotaValue)) *
          100
        ).toFixed(2),
        (
          (response.resume.total / (response.quotas * response.quotaValue)) *
          100
        ).toFixed(2),
      ];
      this.optionsResume = {
        legend: {
          display: false,
        },
        animation: {
          duration: 4000,
        },
        cutoutPercentage: 95,
      };
    });
  }
  
  getEmbeddedVideoUrl(url: SafeResourceUrl): SafeResourceUrl {
    const videoId = this.extractVideoId(url);
  
    const embeddedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
  
    return embeddedUrl;
  }
  
  private extractVideoId(url: SafeResourceUrl): string | null {
    const urlString = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, url);
  
    const match = urlString?.match(
      /(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))(.*?)(?:[?&]t=|&|$)/
    );
  
    return match && match[1] ? match[1] : null;
  }

  private getCDI(): void {
    this.current = 5.5;
    this.shortTerm = 120;
    this.longTerm = 180;
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      quotas: [null, [this.quotaValidator()]],
      installments: ["1"],
      publicAccess: [false],
    });
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
      this.loader = true;
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
          this.maskMoney.transform(this.amountQuota * this.quotaValue) +
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

  investor() {
    const $this = this;
    this.investorService.getUser().subscribe((response) => {
      if (response.investorProfileStatement) {
        $this.router.navigate([
          "/admin/rounds/investment/incorporator/round/" + this.rounds,
        ]);
      } else {
        bootbox.dialog({
          title: "Perfil completo",
          message:
            "O seu cadastro de investidor está incompleto, favor preencher antes de realizar o investimento",
          buttons: {
            ok: {
              label: "Entendi",
              className: "bg-upangel",
              callback: function () {
                $this.router.navigate(["/admin/user/perfil"]);
              },
            },
          },
        });
      }
    });
  }

  getUser() {
    this.investorService.getUser().subscribe((response) => {
      this.investors = response;
    });
  }

  alterPost() {
    this.newPost = !this.newPost;
  }

  removeElement(id) {
    const elem = document.getElementById(id);
    return elem.parentNode.removeChild(elem);
  }

  counter(i: number) {
    return new Array(i);
  }
}
