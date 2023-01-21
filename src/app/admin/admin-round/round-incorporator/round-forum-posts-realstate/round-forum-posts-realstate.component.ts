import { Component, OnInit } from "@angular/core";
import { ForumService } from "../../../../core/service/forum.service";
import { InvestorService } from "../../../../core/service/investor.service";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Forum } from "../../../../core/interface/forum";
import { RoundService } from "../../../../core/service/round.service";
import { Investor } from "../../../../core/interface/investor";

declare var $: any;
declare var bootbox: any;
declare var toastr: any;
declare var moment: any;

@Component({
  selector: "app-round-forum-posts-realstate",
  templateUrl: "./round-forum-posts-realstate.component.html",
  styleUrls: ["./round-forum-posts-realstate.component.css"],
})
export class RoundForumPostsRealstateComponent implements OnInit {
  form: FormGroup;
  posts: Forum;
  investors: Investor;
  roundId = 0;
  newPost = false;
  loader = true;
  name = "";
  logo = "";

  constructor(
    private activedRouter: ActivatedRoute,
    private formBuilder: FormBuilder,
    private forumService: ForumService,
    private roundService: RoundService,
    private investorService: InvestorService
  ) {}

  ngOnInit() {
    this.activedRouter.params.subscribe((params) => {
      this.roundId = params["roundId"];
    });

    this.initForm();

    this.getUser();

    this.roundService
      .getRealStateRoundById(this.roundId)
      .subscribe((response) => {
        this.posts = response.posts;
        this.name = response.property;
        this.logo = response.logo;
      });
  }

  initForm() {
    this.form = this.formBuilder.group({
      description: [null, [Validators.required]],
    });
  }

  getUser() {
    this.investorService.getUser().subscribe((response) => {
      this.investors = response;
      this.loader = false;
    });
  }

  onSubmit() {
    const $this = this;

    if (this.form.valid) {
      this.forumService
        .createPostRealState(this.roundId, this.form.value)
        .subscribe(
          (response) => {
            bootbox.dialog({
              title: "",
              message: "Comentário enviado com sucesso.",
              buttons: {
                success: {
                  label: "Entendi",
                  className: "bg-upangel",
                  callback: function () {
                    $this.newPost = false;
                    $this.ngOnInit();
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
          }
        );
    } else {
      this.validateAllFields(this.form);
      toastr.error(
        "Formulário preenchido incorretamente. Por favor revise seus dados."
      );
    }
  }

  postDelete(id) {
    const $this = this;

    bootbox.dialog({
      title: "",
      message: "Tem certeza que deseja excluir o comentário?",
      buttons: {
        success: {
          label: "Confirmar",
          className: "bg-upangel",
          callback: function () {
            $this.forumService.deletePost(id).subscribe((response) => {
              $this.removeElement("post" + id);
              toastr.success("Comentário excluído.");
            });
          },
        },
      },
    });
  }

  commentDelete(postId, commentId) {
    const $this = this;

    bootbox.dialog({
      title: "",
      message: "Tem certeza que deseja excluir o comentário?",
      buttons: {
        success: {
          label: "Confirmar",
          className: "bg-upangel",
          callback: function () {
            $this.forumService
              .deleteComment(postId, commentId)
              .subscribe((response) => {
                $this.removeElement("comment" + commentId);
                toastr.success("Comentário excluído.");
              });
          },
        },
      },
    });
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

  alterPost() {
    this.newPost = !this.newPost;
  }

  removeElement(id) {
    const elem = document.getElementById(id);
    return elem.parentNode.removeChild(elem);
  }
}
