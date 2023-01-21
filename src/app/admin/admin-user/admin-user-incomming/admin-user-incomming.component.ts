import { DateMaskPipe } from './../../../core/pipes/date-mask.pipe';
import { TiposModalidades } from './../../../core/enums/modalidades.enum';
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { InvestorService } from "../../../core/service/investor.service";
import { TitleHeader } from "../../../core/interface/title-header";
import { TitleService } from "../../../core/service/title.service";

declare var moment: any;

@Component({
  selector: "app-admin-user-incomming",
  templateUrl: "./admin-user-incomming.component.html",
  styleUrls: ["./admin-user-incomming.component.css"],
})
export class AdminUserIncommingComponent implements OnInit {
  form: FormGroup;
  titleHeader: TitleHeader;
  loader: boolean;
  textRegister = "Nenhum registro encontrado.";
  p = 1;
  q = 1;
  responsive = true;
  labels: any = {
    previousLabel: "Anterior",
    nextLabel: "Próximo",
  };
  incommings = [];
  dataInvestment: any;
  dataInvestmentFilter: any;
  firstDay: any;
  lastDay: any;

  sumInvestment = 0;

  constructor(
    private investorService: InvestorService,
    private formBuilder: FormBuilder,
    private data: TitleService,
    private dateMask: DateMaskPipe
  ) {}

  ngOnInit() {
    this.data.currentMessage.subscribe((titles) => (this.titleHeader = titles));
    this.titleHeader.title = "Meu Perfil / Meus Investimentos";
    this.data.changeTitle(this.titleHeader);
    this.firstDay = moment().subtract(24, "months").format("01/MM/YYYY");
    this.lastDay = moment().endOf("month").format("DD/MM/YYYY");
    this.getUserInvestments();
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      initialDate: [this.firstDay],
      finalDate: [this.lastDay],
    });
  }

  private getUserInvestments(): void {
    this.loader = true;
    this.investorService.getUser().subscribe((response) => {
      this.dataInvestment = response.realStateInvestments;

      if (this.dataInvestment != null) {
        this.dataInvestment
          .sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          })
          .reverse();

        this.dataInvestmentFilter = this.dataInvestment;

        for (let i = 0; i < this.dataInvestmentFilter.length; i++) {
          this.sumInvestment += this.dataInvestmentFilter[i].value;
        }
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
        return val.replace(/\D/g, "").length === 11
          ? "(00) 00000-0000"
          : "(00) 0000-00009";
      },
      spOptions = {
        onKeyPress: function (val, e, field, options) {
          field.mask(SPMaskBehavior.apply({}, arguments), options);
        },
      };
    $(".phone").mask(SPMaskBehavior, spOptions);
    $(".zipCode").mask("00000-000");
    $(".cpf").mask("000.000.000-00");
    $(".dateOfInvestment").mask("00/00/0000");
    $(".money").mask("#.##0,00", {
      reverse: true,
    });
  }

  public maskStatus(status: string): string {
    let formatedStatus = "";
    switch (status) {
      case "PENDING":
        formatedStatus = "PENDENTE";
        break;
      case "CONTRACT_SEND":
        formatedStatus = "ENVIADO";
        break;
      case "CONTRACT_SIGNED":
        formatedStatus = "ASSINADO";
        break;
      case "CONFIRMED":
        formatedStatus = "CONFIRMADO";
        break;
    }
    return formatedStatus;
  }

  public maskContract(contract: string): string {
    return contract == null ? " " : contract;
  }

  public maskSigned(date: any): string {
    return date == null ? "------" : this.dateMask.transform(date);
  }

  public maskStatusRound(status: string): string {
    let formatedStatus = "";
    switch (status) {
      case "IN_PROGRESS":
        formatedStatus = "ANDAMENTO";
        break;
      case "FINISHED":
        formatedStatus = "CONCLUÍDA";
        break;
    }
    return formatedStatus;
  }

  public maskModel(model: string): string {
    const aux = TiposModalidades[model];
    if (!aux) {
      return ""
    }

    return aux;
  }

  public filterInvestment() {
    if (this.dataInvestment != null) {
      let initialDate = this.form.controls["initialDate"].value;
      let finalDate = this.form.controls["finalDate"].value;

      if (this.validateDate(initialDate) && this.validateDate(finalDate)) {
        initialDate = new Date(
          this.dateMask.transform(this.form.controls["initialDate"].value, 'AMERICAN')
        );
        finalDate = new Date(
          this.dateMask.transform(this.form.controls["finalDate"].value, 'AMERICAN')
        );

        this.dataInvestmentFilter = this.dataInvestment.filter(function (a) {
          const aDate = new Date(a.date);
          return aDate >= initialDate && aDate <= finalDate;
        });

        this.sumInvestment = 0;

        for (let i = 0; i < this.dataInvestmentFilter.length; i++) {
          this.sumInvestment += this.dataInvestmentFilter[i].value;
        }
      }
    }
  }

  public clearInitial(): void {
    this.form.controls["initialDate"].setValue("");
  }

  public clearFinal(): void {
    this.form.controls["finalDate"].setValue("");
  }

  private validateDate(input: string): boolean {
    const date = input;
    let ardt = new Array();
    const ExpReg = new RegExp(
      "(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/[12][0-9]{3}"
    );
    ardt = date.split("/");
    let erro = false;
    if (date.search(ExpReg) === -1) {
      erro = true;
    } else if (
      (ardt[1] === 4 || ardt[1] === 6 || ardt[1] === 9 || ardt[1] === 11) &&
      ardt[0] > 30
    ) {
      erro = true;
    } else if (ardt[1] === 2) {
      if (ardt[0] > 28 && ardt[2] % 4 !== 0) {
        erro = true;
      }
      if (ardt[0] > 29 && ardt[2] % 4 === 0) {
        erro = true;
      }
    }
    if (erro) {
      return false;
    }
    return true;
  }
}
