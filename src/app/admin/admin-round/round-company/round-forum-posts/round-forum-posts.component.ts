import { LoaderService } from './../../../../core/service/loader.service';
import { DateMaskPipe } from './../../../../core/pipes/date-mask.pipe';
import { MoneyMaskPipe } from './../../../../core/pipes/money-mask.pipe';
import { Component, OnInit } from '@angular/core';
import { ForumService } from '../../../../core/service/forum.service';
import { InvestorService } from '../../../../core/service/investor.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Forum } from '../../../../core/interface/forum';
import { RoundService } from '../../../../core/service/round.service';
import { Investor } from '../../../../core/interface/investor';

declare var $: any;
declare var bootbox: any;
declare var toastr: any;
declare var moment: any;

@Component({
  selector: 'app-round-forum-posts',
  templateUrl: './round-forum-posts.component.html',
  styleUrls: ['./round-forum-posts.component.css']
})
export class RoundForumPostsComponent implements OnInit {

  form: FormGroup;
  posts: Forum;
  investors: Investor;
  company = 0;
  rounds = 0;
  newPost = false;
  loader = true;
  name = '';
  quotaValueI = 0;
  partnerParticipation = 0;
  quotaValue = '';
  startedAt: any;
  finishAt: any;
  status = '';
  logo = '';
  porcent = '';
  duration = 0;

  loading: boolean = false;

  constructor(private activedRouter: ActivatedRoute,
    private formBuilder: FormBuilder,
    private forumService: ForumService,
    private roundService: RoundService,
    private maskMoney: MoneyMaskPipe,
    private investorService: InvestorService,
    private dateMask: DateMaskPipe,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {

    this.activedRouter.params.subscribe(params => {
      this.company = params['id'];
      this.rounds = params['id2'];
    });

    this.initForm();

    this.getUser();

    this.roundService.getRound(this.company, this.rounds).subscribe((response) => {
      this.posts = response.round.posts;
      this.name = response.name;
      this.quotaValueI = response.round.quotaValue;
      this.partnerParticipation = response.round.partnerParticipation;
      this.quotaValue = this.maskMoney.transform(response.round.quotaValue);
      this.startedAt = this.dateMask.transform(response.round.startedAt);
      this.finishAt = moment(this.startedAt, 'DD-MM-YYYY').add('days', this.duration).format('DD/MM/YYYY');
      this.status = response.round.status;
      this.duration = response.round.duration;
      this.logo = response.round.logo;
      this.porcent = Number(((response.round.resume.total / response.round.maximumValuation) * 100).toFixed(0)) + '%';
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
      this.loading = true;
      this.loaderService.load(this.loading);
      this.forumService.createPost(this.rounds, this.form.value).subscribe((response) => {
        bootbox.dialog({
          title: '',
          message: 'Comentário enviado com sucesso.',
          buttons: {
            'success': {
              label: 'Entendi',
              className: 'bg-upangel',
              callback: function () {
                $this.newPost = false;
                $this.ngOnInit();
              }
            }
          }
        });
      }, (error) => {
        const erro = 'Ocorreu um erro, entre em contato com o administrador.';
        toastr.options = {
          'closeButton': true,
          'debug': false,
          'newestOnTop': false,
          'progressBar': true,
          'positionClass': 'toast-top-center',
          'preventDuplicates': true,
          'onclick': null,
          'showDuration': '300',
          'hideDuration': '1000',
          'timeOut': '10000',
          'extendedTimeOut': '1000',
          'showEasing': 'swing',
          'hideEasing': 'linear',
          'showMethod': 'fadeIn',
          'hideMethod': 'fadeOut'
        };
        toastr.error(erro, 'Erro');
      }, () => {
        this.loading = false;
        this.loaderService.load(this.loading);
      });
    } else {
      this.validateAllFields(this.form);
      toastr.error('Formulário preenchido incorretamente. Por favor revise seus dados.');
    }
  }

  maskStatus(status) {
    switch (status) {
      case 'IN_PROGRESS':
        return 'Andamento';
      case 'FINISHED':
        return 'Concluída';
      default:
        return '';
    }
  }

  postDelete(id) {

    const $this = this;

    bootbox.dialog({
      title: '',
      message: 'Tem certeza que deseja excluir o comentário?',
      buttons: {
        'success': {
          label: 'Confirmar',
          className: 'bg-upangel',
          callback: function () {
            $this.forumService.deletePost(id).subscribe((response) => {
              $this.removeElement('post' + id);
              toastr.success('Comentário excluído.');
            });
          }
        }
      }
    });
  }

  commentDelete(postId, commentId) {

    const $this = this;

    bootbox.dialog({
      title: '',
      message: 'Tem certeza que deseja excluir o comentário?',
      buttons: {
        'success': {
          label: 'Confirmar',
          className: 'bg-upangel',
          callback: function () {
            $this.forumService.deleteComment(postId, commentId).subscribe((response) => {
              $this.removeElement('comment' + commentId);
              toastr.success('Comentário excluído.');
            });
          }
        }
      }
    });
  }

  validateAllFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({
          onlySelf: true
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
