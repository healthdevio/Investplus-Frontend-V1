import { LoaderService } from './../../../core/service/loader.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { RoundService } from '../../../core/service/round.service';
import { Router } from '@angular/router';
import { TitleHeader } from '../../../core/interface/title-header';
import { TitleService } from '../../../core/service/title.service';

declare var toastr: any;
declare var bootbox: any;

@Component({
  selector: 'app-round-token',
  templateUrl: './round-token.component.html',
  styleUrls: ['./round-token.component.css']
})

export class RoundTokenComponent implements OnInit {

  form: FormGroup;
  titleHeader: TitleHeader;

  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private tokenService: RoundService,
    private router: Router,
    private data: TitleService,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(titles => this.titleHeader = titles);
    this.titleHeader.title = 'Investimentos / Rodadas Exclusivas';
    this.data.changeTitle(this.titleHeader);
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      token: [null, [Validators.required]]
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

  onSubmit() {
    if (this.form.valid) {
      const dataSend = this.form.value;

      const token = {
        token: dataSend.token
      };

      const $this = this;

      this.loading = true;
      this.loaderService.load(this.loading);
      this.tokenService.createToken(token).subscribe((response) => {
        // toastr.success('Seu token foi enviado!');
        bootbox.dialog({
          title: '',
          message: 'Seu token foi enviado com sucesso! A partir de agora você terá acesso a respectiva rodada exclusiva.',
          buttons: {
            'success': {
              label: 'Entendi',
              className: 'bg-upangel',
              callback: function () {
                $this.router.navigate(['/admin/rounds/company/list']);
              }
            }
          }
        });
      }, (error) => {
        if (error.status === 404) {
          toastr.error('O token informado não existe.');
        } else {
          toastr.error('Ocorreu um erro, contate o administrador.');
        }
      }, () => {
        this.loading = false;
        this.loaderService.load(this.loading);
      });
    } else {
      this.validateAllFields(this.form);
      toastr.error('Formulário preenchido incorretamente. Por favor revise seus dados.');
    }
  }

}
