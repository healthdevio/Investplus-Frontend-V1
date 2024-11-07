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
import { HttpClient } from '@angular/common/http';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
  FormGroupDirective,
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
  isPJ: boolean;
  titleHeader: TitleHeader;
  totalInvestedUpangel: any;
  totalInvested: any;
  fileNameRG: string;
  fileSizeRG: string;
  fileNameRGVerse: string;
  fileSizeRGVerse: string;
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

  validationMessages = {
    nameResponsible: "Nome do responsável é obrigatório.",
    nickname: "Apelido é obrigatório.",
    fullName: "Nome completo é obrigatório.",
    cpfResponsible: "CPF do responsável é obrigatório.",
    profession: "Profissão é obrigatória.",
    nationality: "Nacionalidade é obrigatória.",
    gender: "Gênero é obrigatório.",
    maritalStatus: "Estado civil é obrigatório.",
    rgEmitter: "Órgão emissor do RG é obrigatório.",
    rg: "RG é obrigatório e deve ter no máximo 13 caracteres.",
    phone: "Número de telefone é obrigatório.",
    dateOfBirth: "Data de nascimento é obrigatória.",
    zipCode: "CEP é obrigatório.",
    street: "Rua é obrigatória.",
    number: "Número do endereço é obrigatório.",
    neighborhood: "Bairro é obrigatória.",
    city: "Cidade é obrigatória.",
    uf: "UF é obrigatória.",
    investorProfileStatement: "Escolha uma declaração de perfil de investidor.",
    totalInvestedOthers: "Valor total investido é obrigatório e deve ser válido.",
    publicFigure: "Informe se você é uma figura pública.",
    publicProfile: "Informe se o perfil é público.",
    aboutUpangel: "Escolha uma opção de como conheceu a UpAngel.",
    adminFullName: "Nome do administrador é obrigatório.",
    adminCpf: "CPF do administrador é obrigatório.",
    adminRg: "RG do administrador é obrigatório.",
    adminDateOfBirth: "Data de nascimento do administrador é obrigatória.",
    adminPhone: "Telefone do administrador é obrigatório.",
    email: "Email do administrador é obrigatório e deve ser válido.",
    streetpj: "Rua da empresa é obrigatória.",
    numberpj: "Número da empresa é obrigatório.",
    neighborhoodpj: "Bairro da empresa é obrigatório.",
    citypj: "Cidade da empresa é obrigatória.",
    ufpj: "UF da empresa é obrigatória.",
    zipcodepj: "CEP da empresa é obrigatório.",
  };

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
      span:
        "Não investirei, no ano-calendário por meio de plataformas eletrônicas de investimento participativo, mais do que 10% (dez por cento) do maior entre: (i) minha renda bruta anual; ou (ii) o montante total de meus investimentos financeiros.",
    },
    {
      label:
        "Não possuo investimentos financeiros ou renda bruta anual em valor superior a R$ 20 mil",
      value: "UP_TO_10_THOUSAND",
      span:
        "Não investirei, no ano-calendário por meio de plataformas eletrônicas de investimento participativo, mais de R$ 20.000,00 (vinte mil reais).",
    },
  ];

  banks: Bank[] = [];
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
    private bankService: BankService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.clearFiles();
    this.data.currentMessage.subscribe((titles) => (this.titleHeader = titles));
    this.titleHeader.title = "Meu Perfil / Meus Dados";
    this.data.changeTitle(this.titleHeader);
    this.initForm();
    this.getUser();
    this.getBanks();
  }
  
  addEmptyAdminIfNeeded() {
    if (this.admins.length === 0) {
      this.addAdmin();
    }
  }

  ngAfterViewInit() {
    this.initMask();
  }

  getFormValue(controlName: string) {
    return this.form.get(controlName)?.value || '';
  }  

  initForm() {
    this.form = this.formBuilder.group({
      nameResponsible: [null],
      nickname: [null],
      fullName: [null],
      cpfResponsible: [null],
      complement: [null],
      accountBank: [null],
      accountAgency: [null],
      accountNumber: [null],
      profession: [null],
      nationality: [null],
      gender: [null],
      maritalStatus: [null, [Validators.required]],
      rgEmitter: [null, [Validators.required]],
      rg: [null, [Validators.required, Validators.maxLength(13)]],
      phone: [null, [Validators.required]],
      dateOfBirth: [null, [Validators.required]],
      zipCode: [null, [Validators.required]],
      street: [null, [Validators.required]],
      number: [null, [Validators.required]],
      neighborhood: [null, [Validators.required]],
      city: [null, [Validators.required]],
      uf: [null, [Validators.required]],
      investorProfileStatement: ["UP_TO_10_THOUSAND", [Validators.required]],
      totalInvestedOthers: ["0,00", [Validators.required, Validators.minLength(3)]],
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
      addressId: [null], 
      streetpj: [null, Validators.required],
      numberpj: [null, Validators.required],
      neighborhoodpj: [null, Validators.required],
      citypj: [null, Validators.required],
      ufpj: [null, Validators.required],
      zipcodepj: [null, Validators.required],
      admins: this.formBuilder.array([]) 
    });
  }

  get admins(): FormArray {
    return this.form.get('admins') as FormArray;
  }  

  addAdmin() {
    this.admins.push(this.formBuilder.group({
      fullName: [null, Validators.required],
      cpfCnpj: [null, Validators.required],
      rg: [null, Validators.required],
      dateOfBirth: [null, Validators.required],
      gender: [null, Validators.required],
      maritalStatus: [null, Validators.required],
      phone: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]], 
      streetAdmin: [null, Validators.required],
      cityAdmin: [null, Validators.required],
      ufAdmin: [null, Validators.required],
      zipCodeAdmin: [null, Validators.required],
      numberAdmin: [null, Validators.required],
      neighborhoodAdmin: [null, Validators.required],   
    }));
  }  
  
  removeAdmin(index: number) {
    this.admins.removeAt(index);
  }  

  formatDate() {
    let date = this.form.get('dateOfBirth')?.value;
    if (date) {
      date = date.replace(/\D/g, '');
      if (date.length > 2) {
        date = date.substring(0, 2) + '/' + date.substring(2);
      }
      if (date.length > 5) {
        date = date.substring(0, 5) + '/' + date.substring(5, 9);
      }
      this.form.get('dateOfBirth')?.setValue(date, { emitEvent: false });
    }
  }

  applyCepMaskForAdmin(event: Event, adminIndex: number): void {
    const input = event.target as HTMLInputElement;
    let cepValue = input.value.replace(/\D/g, '').slice(0, 8);
  
    if (cepValue.length >= 5) {
      cepValue = cepValue.replace(/(\d{5})(\d{1,3})/, '$1-$2');
    }
    input.value = cepValue;
  
    if (cepValue.replace('-', '').length === 8) {
      this.getAdminAddressByCep(cepValue, adminIndex);
    }
  }

  getAdminAddressByCep(cep: string, adminIndex: number) {
    const cleanCep = cep.replace(/\D/g, '');
  
    this.http.get(`https://viacep.com.br/ws/${cleanCep}/json/`).subscribe((data: any) => {
      if (!data.erro) {
        const adminFormGroup = this.admins.at(adminIndex) as FormGroup;
        adminFormGroup.patchValue({
            streetAdmin: data.logradouro,
            cityAdmin: data.localidade,
            ufAdmin: data.uf, 
            neighborhoodAdmin: data.bairro
        });
      } else {
        toastr.error("CEP não encontrado.");
      }
    }, error => {
      toastr.error("Erro ao buscar o CEP.");
    });
  }

  formatPhone() {
    let phone = this.form.get('phone')?.value;
    if (phone) {
      phone = phone.replace(/\D/g, '');
      if (phone.length > 0) {
        phone = '(' + phone.substring(0, 2) + ') ' + phone.substring(2);
      }
      if (phone.length > 9) {
        phone = phone.substring(0, 9) + '-' + phone.substring(9, 14);
      }
      this.form.get('phone')?.setValue(phone, { emitEvent: false });
    }
  }

  getCepAddress() {
    const cep = this.form.get('zipCode')?.value.replace(/\D/g, '');
    if (cep && cep.length === 8) {
      this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe((data: any) => {
        if (data) {
          this.form.patchValue({
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            uf: data.uf,
            number: null,
            complement: null
          });
        }
      }, error => {
        console.error('Erro ao buscar CEP:', error);
      });
    }
  }

  getCepAddressPJ() {
    const cep = this.form.get('zipCode')?.value.replace(/\D/g, '');
    if (cep && cep.length === 8) {
      this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe((data: any) => {
        if (data) {
          this.form.patchValue({
            streetpj: data.logradouro,
            neighborhoodpj: data.bairro,
            citypj: data.localidade,
            ufpj: data.uf,
            numberpj: null,
          });
        }
      }, error => {
        console.error('Erro ao buscar CEP:', error);
      });
    }
  }

  formatCep() {
    let cep = this.form.get('zipCode')?.value;
    if (cep) {
      cep = cep.replace(/\D/g, '');
      if (cep.length === 8) {
        cep = cep.substring(0, 5) + '-' + cep.substring(5, 8);
        this.form.get('zipCode')?.setValue(cep, { emitEvent: false });
      }
    }
  }

  onCepInput() {
    let cep = this.form.get('zipCode')?.value;
    if (cep) {
      cep = cep.replace(/\D/g, '');
      if (cep.length === 8) {
        this.formatCep();
        this.getCepAddress();
      }
    }
  }

  onCepInputPJ() {
    let cep = this.form.get('zipCode')?.value;
    if (cep) {
      cep = cep.replace(/\D/g, '');
      if (cep.length === 8) {
        this.formatCep();
        this.getCepAddressPJ();
      }
    }
  }

  applyInvestorTypeValidations() {
    if (this.investor?.cnpj) {
      this.toggleValidatorsForInvestorType(); 
      this.toggleAdminValidatorsForPJ();      
    }
  }
  
  toggleValidatorsForInvestorType() {
    if (this.investor?.cnpj) {
      this.form.get('profession')?.clearValidators();
      this.form.get('nationality')?.setValidators([Validators.required]);
      this.form.get('gender')?.setValidators([Validators.required]);
    } else {
      this.form.get('profession')?.setValidators([Validators.required]);
      this.form.get('nationality')?.setValidators([Validators.required]);
      this.form.get('gender')?.setValidators([Validators.required]);
    }
  
    this.form.get('profession')?.updateValueAndValidity();
    this.form.get('nationality')?.updateValueAndValidity();
    this.form.get('gender')?.updateValueAndValidity();
  }
  
  toggleAdminValidatorsForPJ() {
    if (this.investor?.cnpj) {
      this.admins.controls.forEach(adminGroup => {
        adminGroup.get('fullName')?.setValidators([Validators.required]);
        adminGroup.get('cpf')?.setValidators([Validators.required]);
        adminGroup.get('rg')?.setValidators([Validators.required]);
        adminGroup.get('dateOfBirth')?.setValidators([Validators.required]);
        adminGroup.get('phone')?.setValidators([Validators.required]);
  
        adminGroup.get('fullName')?.updateValueAndValidity();
        adminGroup.get('cpf')?.updateValueAndValidity();
        adminGroup.get('rg')?.updateValueAndValidity();
        adminGroup.get('dateOfBirth')?.updateValueAndValidity();
        adminGroup.get('phone')?.updateValueAndValidity();
      });
    }
  }

  getUser(): void {
    this.loader = true;
    this.investorService.getUser().subscribe((response) => {
      this.investor = response;
  
      this.applyInvestorTypeValidations();
  
      this.totalTabs = this.investor?.cnpj ? 5 : 4;
  
      if (this.investor.cnpj) {
        if (!this.tabs.includes("Administradores")) {
          this.tabs.push("Administradores");
          this.tabContents.push("Adicione os administradores da empresa");
        }
      }
  
      this.isPJ = this.investor?.cnpj ? true : false;
    
      if (this.investor?.admins?.length > 0) {
        this.investor.admins.forEach((admin) => {
          this.admins.push(this.formBuilder.group({
            fullName: [admin.fullName, Validators.required],
            cpfCnpj: [admin.cpfCnpj, Validators.required], 
            rg: [admin.rg, Validators.required],
            dateOfBirth: [moment(admin.dateOfBirth).format('DD/MM/YYYY'), Validators.required],
            gender: [admin.gender, Validators.required],
            maritalStatus: [admin.maritalStatus, Validators.required],
            phone: [admin.phone, Validators.required],
            email: [admin.email, [Validators.required, Validators.email]],
            streetAdmin: [admin.streetAdmin, Validators.required],
            cityAdmin: [admin.cityAdmin, Validators.required],
            ufAdmin: [admin.ufAdmin, Validators.required],
            zipCodeAdmin: [admin.zipCodeAdmin, Validators.required],
            numberAdmin: [admin.numberAdmin, Validators.required],
            neighborhoodAdmin: [admin.neighborhoodAdmin, Validators.required],      
          }));
        });
      } else {
        this.addEmptyAdminIfNeeded();
      }
  
      if (response.address !== undefined) {
        this.setFormValue("nickname", response.nickname);
        this.setFormValue("fullName", response.fullName);
        this.setFormValue("addressId", response.address.id);
        this.setFormValue("profession", response.profession);
        this.setFormValue("nationality", response.nationality);
        this.setFormValue("streetpj", response.streetpj);
        this.setFormValue("numberpj", response.numberpj);
        this.setFormValue("neighborhoodpj", response.neighborhoodpj);
        this.setFormValue("citypj", response.citypj);
        this.setFormValue("ufpj", response.ufpj);
        this.setFormValue("zipcodepj", response.zipcodepj);
        this.setFormValue("gender", response.gender);
        this.setFormValue("maritalStatus", response.maritalStatus);
        this.setFormValue("rgEmitter", response.rgEmitter);
        this.setFormValue("rg", response.rg);
        this.setFormValue("phone", this.phoneMask.transform(response.phone));
        this.setFormValue("street", response.address.street);
        this.setFormValue("zipCode", response.address.zipCode);
        this.setFormValue("number", response.address.number);
        this.setFormValue("neighborhood", response.address.neighborhood);
        this.setFormValue("complement", response.address.complement);
        this.setFormValue("city", response.address.city);
        this.setFormValue("uf", response.address.uf);
        this.setFormValue("dateOfBirth", this.dateMask.transform(response.dateOfBirth));
        this.form.get('address')?.patchValue(response.address);
        this.form.get('address')?.patchValue({
          "zipCode": this.cepMask.transform(response.address.zipCode),
        });
  
        this.setFormValue("investorProfileStatement", response.investorProfileStatement);
        this.setFormValue("totalInvestedOthers", this.maskMoney.transform(response.totalInvestedOthers));
        this.setFormValue("investedUpangel", this.maskMoney.transform(response.investedUpangel));
        this.setFormValue("totalInvested", this.maskMoney.transform(response.totalInvestedOthers + response.investedUpangel));
        this.setFormValue("publicFigure", response.publicFigure);
        this.setFormValue("publicProfile", response.publicProfile);
        this.setFormValue("personalWebsite", response.personalWebsite);
        this.setFormValue("facebook", response.facebook);
        this.setFormValue("twitter", response.twitter);
        this.setFormValue("linkedin", response.linkedin);
        this.setFormValue("agent", response.agent);
        this.setFormValue("aboutUpangel", response.aboutUpangel);
        this.setFormValue("nameResponsible", response.nameResponsible);
        this.setFormValue("cpfResponsible", this.cpfMask.transform(response.cpfResponsible));
        this.setFormValue("accountAgency", response.accountAgency);
        this.setFormValue("accountBank", response.accountBank);
        this.setFormValue("accountNumber", response.accountNumber);
  
        this.descriptionCity = response.address.city;
        this.descriptionSite = response.personalWebsite;
        this.facebook = response.facebook;
        this.linkedin = response.linkedin;
        this.twitter = response.twitter;
  
        if (response.dateOfBirth != null) {
          this.descriptionDate = moment(response.dateOfBirth).format("DD") + " de " +
            moment(response.dateOfBirth).locale("pt-br").format("MMMM");
        }
      }
  
      this.base64textString = response.avatar
        ? "data:image/png;base64," + response.avatar
        : "./../../../assets/img/default-profile_01.png";
  
      if (response.rgDocument) {
        this.fileNameRG = "RG_FRENTE.png";  
        this.fileSizeRG = ((response.rgDocument.length * (3 / 4)) / (1024 * 1024)).toFixed(2);  
        this.base64RG = "data:image/png;base64," + response.rgDocument;
      }
  
      if (response.rgDocumentVerse) {
        this.fileNameRGVerse = "RG_VERSO.png"; 
        this.fileSizeRGVerse = ((response.rgDocumentVerse.length * (3 / 4)) / (1024 * 1024)).toFixed(2); 
        this.base64RG = "data:image/png;base64," + response.rgDocumentVerse;
      }
  
      setTimeout(() => {
        this.initMask();
      }, 1000);
  
      this.loader = false;
    });
  }
  
  
  
  private setFormValue(controlName: string, value: any) {
    if (this.form.controls[controlName]) {
      this.form.controls[controlName].setValue(value);
    }
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
    const nonEmptyAdmins = this.admins.controls.filter(admin => {
      const val = admin.value;
      return val.fullName || val.cpfCnpj || val.rg || val.dateOfBirth || val.phone;
    });
  
    if (!this.form.get('nickname')?.value) {
      this.setFormValue('nickname', this.investor.nickname);
    }
    if (!this.form.get('fullName')?.value) {
      this.setFormValue('fullName', this.investor.fullName);
    }
  
    if (this.form.valid) {
      const dataSend = {
        ...this.form.value,
        streetpj: this.form.get('streetpj')?.value,
        numberpj: this.form.get('numberpj')?.value,
        neighborhoodpj: this.form.get('neighborhoodpj')?.value,
        citypj: this.form.get('citypj')?.value,
        ufpj: this.form.get('ufpj')?.value,
        zipcodepj: this.unmaskInput(this.form.get('zipcodepj')?.value),
        admins: nonEmptyAdmins.map(adminControl => ({
          ...adminControl.value,
          zipCodeAdmin: this.unmaskInput(adminControl.value.zipCodeAdmin),
          dateOfBirth: moment(adminControl.value.dateOfBirth, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        }))
      };
      dataSend.phone = Number(this.unmaskInput(dataSend.phone));
      dataSend.dateOfBirth = moment(this.form.get('dateOfBirth').value, 'DD/MM/YYYY').format('YYYY-MM-DD');
      dataSend.investedUpangel = parseFloat(this.unmaskMoney(dataSend.investedUpangel).replace(",", "."));
      dataSend.totalInvestedOthers = parseFloat(this.unmaskMoney(dataSend.totalInvestedOthers).replace(",", "."));
  
      if (this.investor.cnpj !== undefined) {
        dataSend.cnpj = this.investor.cnpj;
        dataSend.cpfResponsible = this.unmaskInput(dataSend.cpfResponsible);
      } else {
        dataSend.cpf = this.investor.cpf;
      }
  
      dataSend.address = {
        id: dataSend.addressId,
        zipCode: this.unmaskInput(dataSend.zipCode),
        street: dataSend.street,
        number: dataSend.number,
        complement: dataSend.complement,
        neighborhood: dataSend.neighborhood,
        city: dataSend.city,
        uf: dataSend.uf
      };
  
      this.loading = true;
      this.loaderService.load(this.loading);
  
      this.investorService.updateInvestor(dataSend)
        .pipe(finalize(() => {
          this.loading = false;
          this.loaderService.load(this.loading);
        }))
        .subscribe({
          next: () => {
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
        });
    } else {
      this.loading = false;
      this.loaderService.load(this.loading);
  
      const errorMessages = this.generateErrorMessage(this.form);
      toastr.error(`Formulário preenchido incorretamente. Por favor, revise os seguintes campos: ${errorMessages}`);
    }
  }
  
  generateErrorMessage(formGroup: FormGroup): string {
    let messages: string[] = [];
  
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
  
      if (control instanceof FormGroup) {
        const nestedMessages = this.generateErrorMessage(control);
        if (nestedMessages) messages.push(`${key}: ${nestedMessages}`);
      } else if (control instanceof FormArray) {
        control.controls.forEach((group, index) => {
          if (group instanceof FormGroup) {
            const arrayMessages = this.generateErrorMessage(group);
            if (arrayMessages) messages.push(`Administrador ${index + 1}: ${arrayMessages}`);
          }
        });
      } else if (control && control.invalid && control.errors) {
        const errorMessage = this.validationMessages[key] || `Campo ${key} está incorreto`;
        messages.push(errorMessage);
      }
    });
  
    return messages.join("; ");
  }
  
  
  onDevelopmentToast() {
    toastr.options = {
      closeButton: true,
      debug: false,
      newestOnTop: false,
      progressBar: true,
      positionClass: "toast-top-right",
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

    toastr.error('Em desenvolvimento');
  }

  tabs: string[] = ['Geral', 'Endereço', 'Perfil', 'Social', 'Dados bancários'];
  totalTabs: number;


  tabContents: string[] = [
    'Dados gerais da conta',
    'Meu endereço',
    'Detalhes do perfil',
    'Links sociais',
    'Informações bancárias',
  ];
  activeTab: number = 0;

  setActiveTab(index: number): void {
    this.activeTab = index;
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
        control.markAsTouched({ onlySelf: true });
  
        if (control.invalid) {
          const errorMessage = this.validationMessages[field];
          if (errorMessage) {
            toastr.error(errorMessage, "Erro no formulário", {
              timeOut: 10000,
              extendedTimeOut: 1000,
              closeButton: true,
              progressBar: true,
              positionClass: "toast-top-right",
            });
          } else {
            toastr.error(`O campo ${field} está incorreto.`, "Erro no formulário", {
              timeOut: 10000,
              extendedTimeOut: 1000,
              closeButton: true,
              progressBar: true,
              positionClass: "toast-top-right",
            });
          }
        }
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

        reader.onload = (event: any) => {
          const fileContent = event.target.result;
          this.handleRGLoaded(fileContent);

          this.fileNameRG = file.name;
          this.fileSizeRG = (file.size / (1024 * 1024)).toFixed(2);  
        };

        reader.readAsDataURL(file);
      }
    }
  }


  onUploadRGVerse(evt: any) {
    const file = evt.target.files[0];

    if (file) {
      if (file.size > 52428800) {
        toastr.error("O tamanho máximo permitido é 50MB.");
      } else {
        this.msg = "";
        const reader = new FileReader();

        reader.onload = (event: any) => {
          const fileContent = event.target.result;
          this.handleRGLoadedVerse(fileContent);
          console.log(file)
          this.fileNameRGVerse = file.name;
          this.fileSizeRGVerse = (file.size / (1024 * 1024)).toFixed(2);  
        };

        reader.readAsDataURL(file);
      }
    }
  }


  handleRGLoaded(fileContent: string) {
    this.loading = true;
  
    const base64Data = fileContent.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
  
    const rg = {
      rg: base64Data,
    };
  
    this.investorService
      .uploadRG(rg)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe(
        (response) => { },
        (error) => {
          const erro = "Não foi possível enviar/atualizar o RG";
          toastr.error(erro, "Erro");
        }
      );
  }  

  handleRGLoadedVerse(fileContent: string) {
    this.loading = true;
  
    const base64Data = fileContent.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
  
    this.base64RG = fileContent; 
  
    const rg = {
      rg: base64Data,  
    };
  
    this.investorService
      .uploadRGVerse(rg)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe(
        (response) => { },
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
        (response) => { },
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

  getBanks() {
    this.$banks?.unsubscribe();

    this.$banks = this.bankService
      .getAll()
      .subscribe({
        next: (response: HttpResponse<Bank[]>) => {
          if (response.status !== 200) {
            return;
          }
          this.banks = response.body
            .map(bank => {
              if (bank.code) {
                bank.name = `${String(bank.code).padStart(3, "0")} - ${bank.name}`;
              }
              return bank;
            })
            .sort((a: Bank, b: Bank) => a.name > b.name ? 1 : -1);
        }
      });
  }

  clearFiles() {
    this.fileNameRG = null;
    this.fileSizeRG = null;
    this.fileNameRGVerse = null;
    this.fileSizeRGVerse = null;
  }

  applyCpfMask(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); 
  }
  
  applyRgMask(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value
      .replace(/\D/g, '')
      .slice(0, 9)
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1})$/, '$1-$2'); 
  }
  
  applyDateMask(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value
      .replace(/\D/g, '')
      .slice(0, 8) 
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2'); 
  }
  
  applyPhoneMask(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value
      .replace(/\D/g, '')
      .slice(0, 11) 
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4,5})(\d{4})$/, '$1-$2'); 
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }
  
  
}
