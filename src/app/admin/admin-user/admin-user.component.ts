import { LoaderService } from './../../core/service/loader.service';
import { DateMaskPipe } from './../../core/pipes/date-mask.pipe';
import { CepMaskPipe } from './../../core/pipes/cep-mask.pipe';
import { PhoneMaskPipe } from './../../core/pipes/phone-mask.pipe';
import { CpfMaskPipe } from './../../core/pipes/cpf-mask.pipe';
import { MoneyMaskPipe } from './../../core/pipes/money-mask.pipe';
import { Component, OnInit, AfterViewInit } from "@angular/core";
import { InvestorService } from "../../core/service/investor.service";
import { Investor } from "../../core/interface/investor";
import { UserService } from "../../core/service/user.service";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { RadioOption } from "../../share/radio/radio-option.model";
import { Router } from "@angular/router";
import * as moment from "moment";
import { TitleService } from "../../core/service/title.service";
import { TitleHeader } from "../../core/interface/title-header";
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Bank } from '../../core/interface/bank';
import { BankService } from '../../core/service/bank.service';

declare var $: any;
declare var bootbox: any;
declare var toastr: any;

@Component({
  selector: "app-admin-user",
  templateUrl: "./admin-user.component.html",
  styleUrls: ["./admin-user.component.css"],
})
export class AdminUserComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  titleHeader: TitleHeader;
  totalInvestedUpangel: any;
  totalInvested: any;
  investor: Investor;
  investmentValue = "";
  loader: boolean;
  loading: boolean = false;
  base64textString = "./../../../assets/img/default-profile_01.png";
  base64RG: string | null = null;
  msg = "";
  facebook: string;
  linkedin: string;
  twitter: string;
  descriptionCity: string;
  descriptionDate: string;
  descriptionSite: string;

  publicFigures: RadioOption[] = [
    {
      label: "Sim",
      value: true,
      span: "",
    },
    {
      label: "Não",
      value: false,
      span: "",
    },
  ];

  investorProfileStatements: RadioOption[] = [
    {
      label: "Possuo investimentos financeiros em valor superior a R$ 1 milhão",
      value: "ABOVE_MILLION",
      span:
        "Sou investidor qualificado, conforme definido na ICVM n.º 539 e posteriores alterações.",
    },
    {
      label:
        "Possuo investimentos financeiros ou renda bruta anual em valor superior a R$ 200 mil",
      value: "UP_TO_100_THOUSAND",
      // tslint:disable-next-line:max-line-length
      span:
        "Não investirei, no ano-calendário por meio de plataformas eletrônicas de investimento participativo, mais do que 10% (dez por cento) do maior entre: (i) minha renda bruta anual; ou (ii) o montante total de meus investimentos financeiros.",
    },
    {
      label:
        "Não possuo investimentos financeiros ou renda bruta anual em valor superior a R$ 20 mil",
      value: "UP_TO_10_THOUSAND",
      // tslint:disable-next-line:max-line-length
      span:
        "Não investirei, no ano-calendário por meio de plataformas eletrônicas de investimento participativo, mais de R$ 20.000,00 (vinte mil reais).",
    },
  ];

  banks: Bank[] = []
  $banks!: Subscription;

  constructor(
    private router: Router,
    private investorService: InvestorService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private data: TitleService,
    private maskMoney: MoneyMaskPipe,
    private cpfMask: CpfMaskPipe,
    private phoneMask: PhoneMaskPipe,
    private cepMask: CepMaskPipe,
    private dateMask: DateMaskPipe,
    private loaderService: LoaderService,
    private bankService: BankService
  ) { }

  ngOnInit() {
    this.data.currentMessage.subscribe((titles) => (this.titleHeader = titles));
    this.titleHeader.title = "Meu Perfil / Meus Dados";
    this.data.changeTitle(this.titleHeader);
    this.initForm();
    this.getUser();
    this.getBanks();
  }

  ngAfterViewInit() {
    this.initMask();
  }

  initForm() {
    this.form = this.formBuilder.group({
      nameResponsible: [null],
      cpfResponsible: [null],
      profession: [null, [Validators.required]],
      nationality: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      maritalStatus: [null, [Validators.required]],
      rgEmitter: [null, [Validators.required]],
      rg: [null, [Validators.required, Validators.maxLength(13)]],
      phone: [null, [Validators.required]],
      dateOfBirth: [null, [Validators.required]],
      address: this.formBuilder.group({
        id: [null],
        zipCode: [null, [Validators.required]],
        street: [null, [Validators.required]],
        number: [null, [Validators.required]],
        complement: [null],
        neighborhood: [null, [Validators.required]],
        city: [null, [Validators.required]],
        uf: [null, [Validators.required]],
      }),
      investorProfileStatement: ["UP_TO_10_THOUSAND", [Validators.required]],
      totalInvestedOthers: [
        "0,00",
        [Validators.required, Validators.minLength(3)],
      ],
      publicFigure: [false, [Validators.required]],
      publicProfile: [false, [Validators.required]],
      personalWebsite: [null],
      facebook: [null],
      twitter: [null],
      linkedin: [null],
      agent: [null],
      aboutUpangel: ["OUTRO", [Validators.required]],
      investedUpangel: ["0,00"],
      totalInvested: ["0,00"],
      accountBank: [null, [Validators.required]],
      accountAgency: [null, [Validators.required]],
      accountNumber: [null, [Validators.required]],
    });
  }

  getUser() {
    this.loader = true;
    this.investorService.getUser().subscribe((response) => {
      this.investor = response;
      if (response.address !== undefined) {
        this.form.controls["profession"].setValue(response.profession);
        this.form.controls["nationality"].setValue(response.nationality);
        this.form.controls["gender"].setValue(response.gender);
        this.form.controls["maritalStatus"].setValue(response.maritalStatus);
        this.form.controls["rgEmitter"].setValue(response.rgEmitter);
        this.form.controls["rg"].setValue(response.rg);
        this.form.controls["phone"].setValue(this.phoneMask.transform(response.phone));
        this.form.controls["dateOfBirth"].setValue(
          this.dateMask.transform(response.dateOfBirth)
        );
        this.form.get('address').patchValue(response.address);
        this.form.get('address').patchValue({
          "zipCode": this.cepMask.transform(response.address.zipCode)
        });
        // this.form.controls["street"].setValue(response.address.street);
        // this.form.controls["number"].setValue(response.address.number);
        // this.form.controls["complement"].setValue(response.address.complement);
        // this.form.controls["neighborhood"].setValue(
        //   response.address.neighborhood
        // );
        // this.form.controls["city"].setValue(response.address.city);
        // this.form.controls["uf"].setValue(response.address.uf);

        this.form.controls["investorProfileStatement"].setValue(
          response.investorProfileStatement
        );
        this.form.controls["totalInvestedOthers"].setValue(
          this.maskMoney.transform(response.totalInvestedOthers)
        );
        this.form.controls["investedUpangel"].setValue(
          this.maskMoney.transform(response.investedUpangel)
        );
        this.form.controls["totalInvested"].setValue(
          this.maskMoney.transform(
            response.totalInvestedOthers + response.investedUpangel
          )
        );
        this.form.controls["publicFigure"].setValue(response.publicFigure);
        this.form.controls["publicProfile"].setValue(response.publicProfile);
        this.form.controls["personalWebsite"].setValue(
          response.personalWebsite
        );
        this.form.controls["facebook"].setValue(response.facebook);
        this.form.controls["twitter"].setValue(response.twitter);
        this.form.controls["linkedin"].setValue(response.linkedin);
        this.form.controls["agent"].setValue(response.agent);
        this.form.controls["aboutUpangel"].setValue(response.aboutUpangel);
        this.form.controls["nameResponsible"].setValue(
          response.nameResponsible
        );
        this.form.controls["cpfResponsible"].setValue(
          this.cpfMask.transform(response.cpfResponsible)
        );
        this.form.controls["accountAgency"].setValue(response.accountAgency);
        this.form.controls["accountBank"].setValue(response.accountBank);
        this.form.controls["accountNumber"].setValue(response.accountNumber);
        this.descriptionCity = response.address.city;
        this.descriptionSite = response.personalWebsite;
        this.facebook = response.facebook;
        this.linkedin = response.linkedin;
        this.twitter = response.twitter;
        if (
          response.dateOfBirth != null ||
          response.dateOfBirth !== undefined
        ) {
          this.descriptionDate =
            moment(response.dateOfBirth).format("DD") +
            " de " +
            moment(response.dateOfBirth).locale("pt-br").format("MMMM");
        }
      }
      this.base64textString =
        response.avatar === undefined
          ? "./../../../assets/img/default-profile_01.png"
          : "data:image/png;base64," + response.avatar;
      this.base64RG =
        response.rgDocument === undefined
          ? null
          : "data:image/png;base64," + response.rgDocument;
      const $this = this;
      setTimeout(function () {
        $this.initMask();
      }, 1000);
      this.loader = false;
    });
  }

  unmaskInput(input) {
    if (input === undefined) {
      return input;
    }
    return input.replace(/[^\d]+/g, "");
  }

  unmaskMoney(input) {
    if (input === undefined) {
      return input;
    }
    return (Number(input.replace(/[^\d]+/g, "")) / 100).toFixed(2);
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
    $(".dateOfBirth").mask("00/00/0000");
    $(".money").mask("#.##0,00", {
      reverse: true,
    });
    $(".number").keyup(function () {
      $(this).val(this.value.replace(/\D/g, ""));
    });
  }

  onSubmit() {
    if (this.form.valid) {

      const dataSend = this.form.value;
      dataSend.address.zipCode = this.unmaskInput(dataSend.address.zipCode );
      dataSend.zipCode = undefined;
      dataSend.street = undefined;
      dataSend.number = undefined;
      dataSend.complement = undefined;
      dataSend.neighborhood = undefined;
      dataSend.city = undefined;
      dataSend.uf = undefined;
      dataSend.investedUpangel = undefined;
      dataSend.totalInvested = undefined;

      dataSend.phone = this.unmaskInput(dataSend.phone);
      dataSend.dateOfBirth = this.dateMask.transform(dataSend.dateOfBirth, 'AMERICAN');
      dataSend.totalInvestedOthers = this.unmaskMoney(
        dataSend.totalInvestedOthers
      );
      //dataSend.address = address;
      dataSend.cpf = this.investor.cpf;
      dataSend.email = this.investor.email;
      dataSend.fullName = this.investor.fullName;
      dataSend.nickname = this.investor.nickname;
      dataSend.rg = dataSend.rg.replace(/\s/g, "");

      if (this.investor.cnpj !== undefined) {
        dataSend.nameResponsible = dataSend.nameResponsible;
        dataSend.cpfResponsible = this.unmaskInput(dataSend.cpfResponsible);
      }

      if(!this.base64RG){
        toastr.error("Foto do RG é obrigatório");
        return
      }

      this.loading = true;
      this.loaderService.load(this.loading);

      this.investorService
        .updateInvestor(dataSend)
        .pipe(
          finalize(() => {
            this.loading = false;
            this.loaderService.load(this.loading);
          })
        )
        .subscribe({
          next:(response) => {
            toastr.success("Dados atualizados.");
            this.router.navigate(["/admin/rounds/incorporator/list"]);
          },
          error: (error) => {
            if (error.error.code === "DUPLICATE_RG") {
              this.form.controls["rg"].setValue("");
              toastr.error("O RG informado já se encontra cadastrado.");
            } else {
              toastr.error("Ocorreu um erro, contate o administrador.");
            }
          }
        }
      );
    } else {
      this.validateAllFields(this.form);
      this.loading = false;
      this.loaderService.load(this.loading);
      toastr.error(
        "Formulário preenchido incorretamente. Por favor revise seus dados."
      );
    }
  }

  redirectTo(uri: string) {
    this.router
      .navigateByUrl("/", {
        skipLocationChange: true,
      })
      .then(() => this.router.navigate([uri]));
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

  validateDate() {
    const date = this.form.controls["dateOfBirth"].value;
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
      this.form.controls["dateOfBirth"].setValue("");
      bootbox.dialog({
        title: "Campo incorreto",
        message: "Insira uma data de nascimento válida.",
        buttons: {
          ok: {
            label: "Fechar",
            className: "bg-upangel",
            callback: function () { },
          },
        },
      });
      return false;
    }
    return true;
  }

  clearAddress() {
    this.form.controls["street"].setValue("");
    this.form.controls["city"].setValue("");
    this.form.controls["uf"].setValue("");
    this.form.controls["neighborhood"].setValue("");
  }

  getCep() {
    let cep = this.form.get("address").get("zipCode").value;
    cep = cep.replace("-", "");
    if (cep !== "") {
      const validacep = /^[0-9]{8}$/;
      if (validacep.test(cep)) {
        /* this.form.controls["street"].setValue("");
        this.form.controls["city"].setValue("");
        this.form.controls["uf"].setValue("");
        this.form.controls["neighborhood"].setValue(""); */
        this.form.get("address").patchValue({
          street: null,
          city: null,
          uf: null,
          neighborhood: null
        });

        this.userService.getAddressByZipCode(cep).subscribe((dados) => {
          if (!("erro" in dados)) {
            this.form.get("address").patchValue({
              street: dados.logradouro,
              city: dados.localidade,
              uf: dados.uf,
              neighborhood: dados.bairro
            });
            /* this.form.controls["street"].setValue(dados.logradouro);
            this.form.controls["city"].setValue(dados.localidade);
            this.form.controls["uf"].setValue(dados.uf);
            this.form.controls["neighborhood"].setValue(dados.bairro); */
          } else {
            this.clearAddress();
            bootbox.dialog({
              title: "Campo incorreto",
              message: "CEP não encontrado.",
              buttons: {
                ok: {
                  label: "Fechar",
                  className: "bg-upangel",
                  callback: function () { },
                },
              },
            });
          }
        });
      } else {
        this.clearAddress();
        bootbox.dialog({
          title: "Campo incorreto",
          message: "Formato de CEP inválido",
          buttons: {
            ok: {
              label: "Fechar",
              className: "bg-upangel",
              callback: function () { },
            },
          },
        });
      }
    } else {
      this.clearAddress();
    }
  }

  calculateInvestment(quota) {
    const investedUpangel = Number(
      this.unmaskMoney(this.form.controls["investedUpangel"].value)
    );
    quota = Number(this.unmaskMoney(quota));

    if (!isNaN(quota) && quota >= 0) {
      this.investmentValue = this.maskMoney.transform(investedUpangel + quota);
    }
  }

  onUploadChange(evt: any) {
    const file = evt.target.files[0];

    if (file) {
      if (file.size > 52428800) {
        this.msg = "O tamanho máximo permitido é 50MB.";
      } else {
        this.msg = "";
        const reader = new FileReader();

        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file);
      }
    }
  }

  onUploadRG(evt: any) {
    const file = evt.target.files[0];

    if (file) {
      if (file.size > 52428800) {
        toastr.error("O tamanho máximo permitido é 50MB.");
      } else {
        this.msg = "";
        const reader = new FileReader();

        reader.onload = this.handleRGLoaded.bind(this);
        reader.readAsBinaryString(file);
      }
    }
  }

  handleRGLoaded(e) {
    this.loading = true;
    this.base64RG = "data:image/png;base64," + btoa(e.target.result);
    const rg = {
      rg: btoa(e.target.result),

    };


    this.investorService
      .uploadRG(rg)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe(
        (response) => {},
        (error) => {
          const erro = "Não foi possível enviar/atualizar o RG";
          toastr.error(erro, "Erro");
        }
      );
  }

  handleReaderLoaded(e) {
    this.loading = true;
    this.base64textString = "data:image/png;base64," + btoa(e.target.result);

    const avatar = {
      avatar: btoa(e.target.result),
    };

    this.investorService
      .updateAvatar(avatar)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe(
      (response) => {},
      (error) => {
        const erro = "Não foi possível atualizar a imagem.";
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

  getBanks(){
    this.$banks?.unsubscribe();

    this.$banks = this.bankService
      .getAll()
      .subscribe({
        next: (response: HttpResponse<Bank[]>) => {

          if(response.status != 200){
            return;
          }

          this.banks = response?.body
            .map(bank => {
              if(bank.code){
                bank.name = `${String(bank.code).padStart(3, "0")} - ${bank.name}`;
              }
              return bank;
            })
            .sort((a: Bank, b: Bank) => a.name > b.name ? 1 : -1);
        }
      })
  }
}
