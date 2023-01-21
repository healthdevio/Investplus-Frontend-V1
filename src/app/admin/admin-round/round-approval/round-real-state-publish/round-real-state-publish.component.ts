import { Component, OnInit } from "@angular/core";
import { RoundService } from "../../../../core/service/round.service";
import { RealStateService } from "../../../../core/service/real-state.service";
import { Router } from "@angular/router";
import { TitleService } from "../../../../core/service/title.service";
import { TitleHeader } from "../../../../core/interface/title-header";

declare var toastr: any;
declare var bootbox: any;

@Component({
  selector: "app-round-real-state-publish",
  templateUrl: "./round-real-state-publish.component.html",
  styleUrls: ["./round-real-state-publish.component.css"],
})
export class RoundRealStatePublishComponent implements OnInit {
  rounds: any;
  status = "PENDING";
  statusApproved = { status: "IN_PROGRESS" };
  errorMessage = "Nenhum registro encontrado.";
  loader: boolean;
  responseError: boolean;
  textRegister = "Nenhum registro encontrado.";
  p = 1;
  responsive = true;
  labels: any = {
    previousLabel: "Anterior",
    nextLabel: "Próximo",
  };
  titleHeader: TitleHeader;

  constructor(
    private roundService: RealStateService,
    private router: Router,
    private data: TitleService
  ) {}

  ngOnInit() {
    this.data.currentMessage.subscribe((titles) => (this.titleHeader = titles));
    this.titleHeader.title = "Administração / Publicar Rodada";
    this.data.changeTitle(this.titleHeader);
    this.responseError = false;
    this.loader = true;
    this.roundService.getAllByStatus(this.status).subscribe(
      (response) => {
        if (
          response.realStateRounds == null ||
          response.realStateRounds.length === 0
        ) {
          this.responseError = true;
          this.loader = false;
          return;
        }
        this.rounds = response.realStateRounds;
        this.loader = false;
      },
      (error) => {
        this.loader = false;
        this.responseError = true;
      }
    );
  }

  getAllByStatus(status) {
    this.loader = true;
    this.roundService.getAllByStatus(status).subscribe(
      (response) => {
        this.rounds = response.realStateRounds;
        this.loader = false;
      },
      (error) => {
        this.loader = false;
        this.responseError = true;
      }
    );
  }

  publishRound(round) {
    const $this = this;
    this.roundService.updateStatus(round, this.statusApproved).subscribe(
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
