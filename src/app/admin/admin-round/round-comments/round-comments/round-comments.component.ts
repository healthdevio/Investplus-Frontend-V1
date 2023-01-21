import { LoaderService } from './../../../../core/service/loader.service';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Forum } from "../../../../core/interface/forum";
import { RoundService } from "../../../../core/service/round.service";
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { ForumService } from "../../../../core/service/forum.service";
import { Location } from "@angular/common";

declare var $: any;
declare var bootbox: any;
declare var toastr: any;
declare var moment: any;

@Component({
  selector: "app-round-comments",
  templateUrl: "./round-comments.component.html",
  styleUrls: ["./round-comments.component.css"],
})
export class RoundCommentsComponent implements OnInit {
  form: FormGroup;
  post = "";
  roundId = 0;
  postId = 0;
  routerRound = "";

  roundType = "";

  posts: Forum;

  newPost = false;
  loader = true;
  name = "";

  logo = "";

  duration = 0;

  loading: boolean = false;

  constructor(
    private _location: Location,
    private router: Router,
    private forumService: ForumService,
    private activedRouter: ActivatedRoute,
    private roundService: RoundService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    this.initForm();

    this.activedRouter.params.subscribe((params) => {
      this.roundType = params["roundType"];
      this.roundId = params["roundId"];
      this.postId = params["postId"];
    });

    this.forumService.getPost(this.postId).subscribe((response) => {
      this.post = response.description;
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
      //TODO resolver se o round for de investimento em empresa
      /*this.routerRound =
        "/admin/rounds/company/" +
        this.company +
        "/round/" +
        this.roundId +
        "/forum";
      this.roundService
        .getRound(this.company, this.round)
        .subscribe((response) => {
          this.posts = response.round.posts;
          this.name = response.name;

          this.logo = response.round.logo;
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
      this.forumService.createComment(this.postId, this.form.value).subscribe(
        (response) => {
          bootbox.dialog({
            title: "",
            message: "Comentário enviado com sucesso.",
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
