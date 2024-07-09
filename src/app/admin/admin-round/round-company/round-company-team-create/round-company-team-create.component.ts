import { LoaderService } from './../../../../core/service/loader.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CompanyService } from '../../../../core/service/company.service';
import { TitleService } from '../../../../core/service/title.service';
import { TitleHeader } from '../../../../core/interface/title-header';
import { Team } from '../../../../core/interface/team';
import { finalize } from 'rxjs/operators';

declare var toastr: any;
declare var bootbox: any;

@Component({
  selector: 'app-round-company-team-create',
  templateUrl: './round-company-team-create.component.html',
  styleUrls: ['./round-company-team-create.component.css']
})

export class RoundCompanyTeamCreateComponent implements OnInit {

  @ViewChild('viewChieldTeamList') viewChieldTeamList: ElementRef;
  @ViewChild('viewChieldTeamListPane') viewChieldTeamListPane: ElementRef;
  @ViewChild('viewChieldTeamAddOrEdit') viewChieldTeamAddOrEdit: ElementRef;
  @ViewChild('viewChieldTeamAddOrEditPane') viewChieldTeamAddOrEditPane: ElementRef;

  titleHeader: TitleHeader;
  form: FormGroup;
  loader: boolean;
  company = 0;
  avatar = '';
  base64textString = '';
  msg = '';
  loading: boolean = false;
  members: Team[] = [];

  constructor(private activedRouter: ActivatedRoute,
    private formBuilder: FormBuilder,
    private companyService: CompanyService,
    private data: TitleService,
    private loaderService: LoaderService,
    private router: Router
  ) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(titles => this.titleHeader = titles);
    this.titleHeader.title = 'Administração / Equipe Executiva';
    this.data.changeTitle(this.titleHeader);
    this.activedRouter.params.subscribe(params => {
      this.company = params['id'];
    });
    this.getTeam();
    this.base64textString = './../../../assets/img/default-profile_01.png';

    this.initForm();
  }

  onUploadChange(evt: any) {
    const file = evt.target.files[0];

    if (file) {

      if (file.size > 52428800) {
        this.msg = 'O tamanho máximo permitido é 50MB.';
      } else {
        this.msg = '';
        const reader = new FileReader();

        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file);
      }
    }
  }

  handleReaderLoaded(e) {

    this.base64textString = 'data:image/png;base64,' + btoa(e.target.result);
    this.avatar = btoa(e.target.result);
  }

  initForm() {
    this.form = this.formBuilder.group({
      id: [null],
      fullName: [null, [Validators.required]],
      email: [null],
      department: [null, [Validators.required]],
      role: [null, [Validators.required]],
      activities: [null, [Validators.required]],
      linkedin: [null]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      let dataSend = this.form.value;
      dataSend.photo = this.avatar;

      dataSend = [dataSend];

      this.loading = true;
      this.loaderService.load(this.loading);
      this.companyService
        .createTeam(this.company, dataSend)
        .pipe(
          finalize(() => {
            this.loading = false;
            this.loaderService.load(this.loading);
          })
        )
        .subscribe({
          next: (response) => {
            toastr.success('Equipe atualizada.');
            this.form.reset();
            this.base64textString = './../../../assets/img/default-profile_01.png';
            this.getTeam();
          },
          error: (error) => {
            toastr.error('Ocorreu um erro, contate o administrador.');
          }
        });
    } else {
      this.validateAllFields(this.form);
      toastr.error('Formulário preenchido incorretamente. Por favor revise seus dados.');
    }
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

  getTeam(){
    this.companyService
      .getTeam(this.company)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.loaderService.load(this.loading);
        })
      )
      .subscribe({
        next: (response) => {
          //if (response.status == 200){
            this.members = response//.body;
            this.viewChieldTeamList.nativeElement.classList.add("active");
            this.viewChieldTeamListPane.nativeElement.classList.add("active");
            this.viewChieldTeamAddOrEdit.nativeElement.classList.remove("active");
            this.viewChieldTeamAddOrEditPane.nativeElement.classList.remove("active");
          //}
        }
      })
  }

  deleteTeamMember(id: number){
    this.loading = true;
    this.loaderService.load(this.loading);
    this.companyService
      .deleteTeamMember(this.company, id)
      .subscribe({
        next: () => {
          toastr.success('Registro excluído com sucesso.');
          this.getTeam();
        },
        error : () => {
          toastr.error('Falha ao excluir registro.');
        }
      })
  }

  onEdit(member){
    this.form.patchValue(member);
    this.base64textString = member.photo ? 'data:image/png;base64,' + member.photo : './../../../assets/img/default-profile_01.png';
    this.viewChieldTeamList.nativeElement.classList.remove("active");
    this.viewChieldTeamListPane.nativeElement.classList.remove("active");
    this.viewChieldTeamAddOrEdit.nativeElement.classList.add("active");
    this.viewChieldTeamAddOrEditPane.nativeElement.classList.add("active");
  }

  onRemove(id: number){
    const $this = this;
    bootbox.confirm({
      title: "Confirmação",
      message: "Deseja realmente excluir o registro?",
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
      callback: (result) => {
        if (result === true) {
          // console.log('[confirmou]')
          this.deleteTeamMember(id);
        }
      },
    });
  }

}
