import { Component, OnInit } from "@angular/core";
import { RoundService } from "../../../../core/service/round.service";
import { Router } from "@angular/router";
import { TitleService } from "../../../../core/service/title.service";
import { TitleHeader } from "../../../../core/interface/title-header";
import { DomSanitizer } from "@angular/platform-browser";
import { FormBuilder, FormGroup } from "@angular/forms";

declare var toastr: any;
declare var bootbox: any;

@Component({
  selector: "app-round-company-publish",
  templateUrl: "./round-company-publish.component.html",
  styleUrls: ["./round-company-publish.component.css"],
})
export class RoundCompanyPublishComponent implements OnInit {
  titleHeader: TitleHeader;
  rounds: any;
  status = "PENDING";
  statusApproved = { status: "IN_PROGRESS" };
  loader: boolean;
  responseError: boolean;
  textRegister = "Nenhum registro encontrado.";
  p = 1;
  responsive = true;
  labels: any = {
    previousLabel: "Anterior",
    nextLabel: "Próximo",
  };

  form: FormGroup;

  constructor(
    private roundService: RoundService,
    private router: Router,
    private data: TitleService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      status: [this.status]
    })
  }

  ngOnInit() {
    this.data.currentMessage.subscribe((titles) => (this.titleHeader = titles));
    this.titleHeader.title = "Administração / Publicar Rodada";
    this.data.changeTitle(this.titleHeader);
    this.getAllByStatus();
  }

  getAllByStatus() {
    this.responseError = false;
    this.loader = true;
    this.rounds = [];
    this.roundService.getAllByStatus(this.form.get('status').value).subscribe(
      (response) => {
        if (
          response.companiesRounds == null ||
          response.companiesRounds.length === 0
        ) {
          this.responseError = true;
          this.loader = false;
          return;
        }
        this.rounds = response.companiesRounds;
        this.loader = false;
      },
      (error) => {
        this.loader = false;
        this.responseError = true;
      }
    );
  }

  publishRound(company, round) {
    const $this = this;

    this.roundService
      .updateStatus(company, round, this.statusApproved)
      .subscribe(
        (response) => {
          bootbox.dialog({
            title: "",
            message: "A rodada foi publicada.",
            buttons: {
              success: {
                label: "Entendi",
                className: "bg-upangel",
                callback: function () {
                  $this.router.navigate(["/admin/rounds/incorporator/list"]);
                },
              },
            },
          });
        },
        (error) => {
          const erro = "Ocorreu um erro, entre em contato com o administrador.";
          toastr.options = {
            closeButton: true,
            debug: false,
            newestOnTop: false,
            progressBar: true,
            positionClass: "toast-top-center",
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
          toastr.error(erro, "Erro");
        }
      );
  }
}
