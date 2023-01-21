import { LoaderService } from './../../../../core/service/loader.service';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { ForumService } from "../../../../core/service/forum.service";
import { Forum } from "../../../../core/interface/forum";
import { RoundService } from "../../../../core/service/round.service";
import { Location } from "@angular/common";

declare var $: any;
declare var bootbox: any;
declare var toastr: any;
declare var moment: any;

@Component({
  selector: "app-round-comments-edit",
  templateUrl: "./round-comments-edit.component.html",
  styleUrls: ["./round-comments-edit.component.css"],
})
export class RoundCommentsEditComponent implements OnInit {
  form: FormGroup;
  post = "";
  comment = "";
  roundId = 0;
  postId = 0;
  commentId = 0;
  routerRound = "";

  roundType = "";

  posts: Forum;
  rounds = 0;
  newPost = false;
  loader = true;
  name = "";

  logo = "";

  loading: boolean = false;

  constructor(
    private _location: Location,
    private roundService: RoundService,
    private router: Router,
    private forumService: ForumService,
    private activedRouter: ActivatedRoute,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    this.activedRouter.params.subscribe((params) => {
      this.roundType = params["roundType"];
      this.roundId = params["roundId"];
      this.postId = params["postId"];
      this.commentId = params["commentId"];
    });

    this.initForm();

    this.forumService.getPost(this.postId).subscribe((response) => {
      this.post = response.description;
    });

    this.forumService
      .getComment(this.postId, this.commentId)
      .subscribe((response) => {
        this.comment = response.description;
      });

    if (this.roundType == "realstate") {
      this.roundService
        .getRealStateRoundById(this.roundId)
        .subscribe((response) => {
          this.posts = response.posts;
          this.name = response.property;
          this.logo = response.logo;
          this.loader = false;
        });
    } else {
      /* this.routerRound =
      "/admin/rounds/company/" +
      this.companyId +
      "/round/" +
      this.roundId +
      "/forum";
      this.roundService
      .getRound(this.companyId, this.roundId)
      .subscribe((response) => {
        this.posts = response.round.posts;
        this.name = response.name;
        this.quotaValueI = response.round.quotaValue;
        this.partnerParticipation = response.round.partnerParticipation;
        this.quotaValue = this.maskMoney(response.round.quotaValue);
        this.startedAt = this.dateMask.transform(response.round.startedAt);
        this.finishAt = moment(this.startedAt, "DD-MM-YYYY")
          .add("days", this.duration)
          .format("DD/MM/YYYY");
        this.status = response.round.status;
        this.duration = response.round.duration;
        this.logo = response.round.logo;
        this.porcent =
          Number(
            (
              (response.round.resume.total / response.round.maximumValuation) *
              100
            ).toFixed(0)
          ) + "%";
        this.loader = false;
      }); */
    }
  }

  initForm() {
    this.form = this.formBuilder.group({
      description: [null, [Validators.required]],
    });
  }

  onSubmit() {
    const $this = this;

    if (this.form.valid) {
      this.loading = true;
      this.loaderService.load(this.loading);
      this.forumService
        .updateComment(this.postId, this.commentId, this.form.value)
        .subscribe(
          (response) => {
            bootbox.dialog({
              title: "",
              message: "Comentário editado com sucesso.",
              buttons: {
                success: {
                  label: "Entendi",
                  className: "bg-upangel",
                  callback: function () {
                    $this.goBack();
                  },
                },
              },
            });
          },
          (error) => {
            const erro =
              "Ocorreu um erro, entre em contato com o administrador.";
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
          }, () => {
            this.loading = false;
            this.loaderService.load(this.loading);
          }
        );
    } else {
      this.validateAllFields(this.form);
      toastr.error(
        "Formulário preenchido incorretamente. Por favor revise seus dados."
      );
    }
  }

  goBack() {
    this._location.back();
  }

  validateAllFields(formGroup: FormGroup) {
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
}
