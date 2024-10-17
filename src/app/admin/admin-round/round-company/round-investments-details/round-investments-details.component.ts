import { DateMaskPipe } from './../../../../core/pipes/date-mask.pipe';
import { CepMaskPipe } from './../../../../core/pipes/cep-mask.pipe';
import { CnpjMaskPipe } from './../../../../core/pipes/cnpj-mask.pipe';
import { CpfMaskPipe } from './../../../../core/pipes/cpf-mask.pipe';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvestmentService } from '../../../../core/service/investment.service';
import { ExcelService } from '../../../../core/service/excel.service';
import { finalize } from 'rxjs/operators';
import { TiposModalidades } from './../../../../core/enums/modalidades.enum';
import { saveAs } from 'file-saver';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

declare var $: any;
declare var toastr: any;
declare var bootbox: any;

@Component({
  selector: 'app-round-investments-details',
  templateUrl: './round-investments-details.component.html',
  styleUrls: ['./round-investments-details.component.css']
})
export class RoundInvestmentsDetailsComponent implements OnInit {
  isSingUpPublishModalOpen: boolean = false;
  investments: any;
  investment: any;
  formStatus: FormGroup;
  searchInvestmentLoading: boolean = false;
  filteredInvestments: any;
  round = 0;
  id = 0;
  textRegister = 'Nenhum registro encontrado.';
  loader: boolean;
  p = 1;
  responsive = true;
  labels: any = {
    previousLabel: 'Anterior',
    nextLabel: 'Próximo'
  };
  type = 'COMPANY';
  isDropdownVisible: number | null = null;

  constructor(
    private router: Router,
    private activedRouter: ActivatedRoute,
    private investmentService: InvestmentService,
    private excelService: ExcelService,
    private cpfMask: CpfMaskPipe,
    private cnpjMask: CnpjMaskPipe,
    private cepMask: CepMaskPipe,
    private dateMask: DateMaskPipe,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.activedRouter.params.subscribe(params => {
      this.round = params['id'];
    });
    this.getUsersInvestments();
    this.initStatus();
  }

  toggleDropdown(index: number) {
    this.isDropdownVisible = this.isDropdownVisible === index ? null : index;
  }

  initStatus() {
    this.formStatus = this.formBuilder.group({
      status: [null, [Validators.required]],
      contractStatus: [null, [Validators.required]]
    })
  }

  exportToCSV() {
    const roundsFilteres = this.filteredInvestments;
    if (roundsFilteres && roundsFilteres.length > 0) {
      const csvData = this.convertToCSV(roundsFilteres);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'investimentos.csv');
    }
  }

  editInvestment(id: number) {
    this.getInvestment(id)
    this.isSingUpPublishModalOpen = true;
    this.id = id;
  }

  private getInvestment(investment: number): void {
    this.searchInvestmentLoading = true;
    this.investmentService.getInvestment(investment).subscribe(
      (response) => {
        this.investment = response;
        this.formStatus.patchValue({
          status: response.status,
          contractStatus: response.contractStatus
        });
        this.searchInvestmentLoading = false;
      }, (error) => {
        toastr.error('Erro ao buscar o investimento.', error);
      });
  }

  publishInvestment() {
    const $this = this;
    this.investmentService
      .updateStatus(this.id, this.formStatus.value.contractStatus)
      .subscribe(
        (response) => {
          bootbox.dialog({
            title: "",
            message: "Status do contrato atualizado com sucesso.",
            buttons: {
              success: {
                label: "Entendi",
                className: "bg-upangel",
                callback: function () {
                  this.isSingUpPublishModalOpen = false;
                  $this.getUsersInvestments();
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

  convertToCSV(objArray: any[]): string {
    const header = ['Nome', 'Perfil', 'Vlr. Outras Plataformas', 'Cotas', 'Total', 'Parc.', '%', 'Data', 'Contrato', 'Status'];
    const rows = objArray.map(investment => [
      investment.investor.fullName,
      this.maskPerfil(investment.investor.investorProfileStatement),
      investment.investor.totalInvestedOthers,
      investment.quotas,
      investment.value,
      investment.installments,
      investment.roundPercent,
      investment.date,
      investment.contractStatus,
      investment.status
    ]);

    const csvContent = [header, ...rows]
      .map(row => row.join(','))
      .join('\n');

    return csvContent;
  }

  public maskModel(model: string): string {
    const aux = TiposModalidades[model];
    if (!aux) {
      return "";
    }
    return aux;
  }

  getUsersInvestments() {
    this.loader = true;
    this.investmentService.getUserInvestment(this.round, this.type).subscribe((response) => {
      this.investments = response;
      this.filteredInvestments = response;
      this.loader = false;
    }, (error) => {
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
      toastr.error('Ocorreu um erro, entre em contato com o administrador.');
    });

  }

  filterInvestments(searchTerm: string) {
    if (searchTerm) {
      this.filteredInvestments = this.investments.filter(investment =>
        investment.investor.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      this.filteredInvestments = this.investments;
    }
  }

  maskPerfil(perfil) {
    let formatedPerfil = '';
    switch (perfil) {
      case 'ABOVE_MILLION':
        formatedPerfil = 'Acima de 1 milhão';
        break;
      case 'UP_TO_100_THOUSAND':
        formatedPerfil = 'Até 200 mil';
        break;
      case 'UP_TO_10_THOUSAND':
        formatedPerfil = 'Até 20 mil';
        break;
    }
    return formatedPerfil;
  }

  maskStatus(status) {
    let formatedStatus = '';
    switch (status) {
      case 'PENDING':
        formatedStatus = 'Pendente';
        break;
      case 'CONTRACT_SEND':
        formatedStatus = 'Enviado';
        break;
      case 'CONTRACT_SIGNED':
        formatedStatus = 'Assinado';
        break;
      case 'CONFIRMED':
        formatedStatus = 'Confirmado';
        break;
    }
    return formatedStatus;
  }

  unmaskInput(input) {
    if (input == null) {
      return '';
    }
    return input.replace(/[^\d]+/g, '');
  }

  unmaskMoney(input) {
    if (input == null) {
      return '';
    }
    return (Number(input.replace(/[^\d]+/g, '')) / 100).toFixed(2);
  }

  updateStatus(investment) {
    const contractId = (<HTMLInputElement>document.getElementById('contractExternalId')).value;
    const statusInvestment = (<HTMLInputElement>document.getElementById('status')).value;

    const status = { status: statusInvestment, contractExternalId: contractId };

    this.investmentService.updateStatus(investment, status).subscribe(
      (response) => {
        this.redirectTo('/admin/rounds/company/investments/' + this.round);
        toastr.success('Status atualizado.');
      }, (error) => {
        if (error.error.code === 'ILLEGAL_ARGUMENT') {
          toastr.error('Status informado é inválido.');
        } else {
          toastr.error('Ocorreu um erro, entre em contato com o administrador.');
        }
      });
  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri]));
  }

  showInvestment(investment) {
    const $this = this;

    let form = '<div class="row"><div class="col-md-8"><div class="form-group"><label class="control-label" for="contractExternalId">Chave Clicksign</label><input value="' + (investment.contractExternalId == null ? '' : investment.contractExternalId) + '" class="form-control"  maxlength="40" type="text" id="contractExternalId"' + (investment.status === 'PENDING' ? '' : 'disabled') + '></div></div>';
    form += '<div class="col-md-4"><div class="form-group"><label class="control-label" for="status">Status</label><select class="form-control" id="status"><option ' + (investment.status === 'PENDING' ? 'selected' : '') + ' value="PENDING">Pendente</option><option ' + (investment.status === 'CONTRACT_SEND' ? 'selected' : '') + ' value="CONTRACT_SEND">Enviado</option><option ' + (investment.status === 'CONTRACT_SIGNED' ? 'selected' : '') + ' value="CONTRACT_SIGNED">Assinado</option><option ' + (investment.status === 'CONFIRMED' ? 'selected' : '') + ' value="CONFIRMED">Confirmado</option></select></div></div>';

    let message = '';
    message += '<div class="row"><div class="col-md-6"><p><b>Profissão: </b>' + investment.investor.profession + '</p></div>';
    message += '<div class="col-md-6"><p><b>E-mail: </b>' + investment.investor.email + '</p></div>';
    message += '<div class="col-md-6"><p>' + (investment.investor.cnpj === undefined ? '<b> CPF: </b>' + this.cpfMask.transform(investment.investor.cpf) : '<b> CNPJ: </b>' + this.cnpjMask.transform(investment.investor.cnpj)) + '</p></div>';
    message += '<div class="col-md-6"><p><b>Politicamente exposta: </b>' + (investment.investor.publicFigure === true ? 'Sim' : 'Não') + '</p></div>';
    message += '<div class="col-md-6"><p><b>RG: </b>' + investment.investor.rg + '</p></div>';
    message += '<div class="col-md-6"><p><b>Orgão emissor: </b>' + investment.investor.rgEmitter + '</p></div>';
    message += '<div class="col-md-6"><p><b>Data de aniversário: </b>' + this.dateMask.transform(investment.investor.dateOfBirth) + '</p></div>';
    message += '<div class="col-md-6"><p><b>Agente: </b>' + (investment.investor.agent == null ? '' : investment.investor.agent) + '</p></div>';
    message += '<div class="col-md-12"><hr style="border-top: 1px solid #ddd;"><p><b>Endereço: </b>' + investment.investor.address.street + ', ' + investment.investor.address.number + '</p></div>';
    message += '<div class="col-xs-12 col-md-6"><p><b>Bairro: </b>' + investment.investor.address.neighborhood + '</p></div>';
    message += '<div class="col-xs-12 col-md-6"><p><b>Complemento: </b>' + (investment.investor.address.complement == null ? '' : investment.investor.address.complement) + '</p></div>';
    message += '<div class="col-xs-12 col-md-6"><p><b>CEP: </b>' + this.cepMask.transform(investment.investor.address.zipCode) + '</p></div>';
    message += '<div class="col-xs-12 col-md-6"><p><b>Cidade: </b>' + investment.investor.address.city + ' - ' + investment.investor.address.uf + '</p></div>';
    message += '<div class="col-md-12"><hr style="border-top: 1px solid #ddd;"></div>';
    message += '<div class="col-xs-12 col-md-6"><p><b>Data Assinatura: </b>' + this.dateMask.transform(investment.contractSignedAt) + '</p></div>';
    message += '<div class="col-xs-12 col-md-6"><p><b>Data Aporte: </b>' + this.dateMask.transform(investment.confirmedAt) + '</p></div>';
    message += '<div class="col-md-12"><hr style="border-top: 1px solid #ddd;"></div></div>';
    message += form;
    bootbox.dialog({
      title: '<b>' + investment.investor.fullName + '</b>',
      message: message,
      size: 'large',
      buttons: {
        cancel: {
          label: 'Cancelar',
          className: 'btn-default',
          callback: function () {
          }
        },
        ok: {
          label: 'Atualizar',
          className: 'bg-upangel',
          callback: function () {
            $this.updateStatus(investment.id);
          }
        }
      }
    });
  }

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.investments, 'investors');
  }

  generateBillets(investment){
    
    investment.loading = true;
    investment?.$sub?.unsubscribe();

    investment.$sub = this.investmentService
      .generateBillets(investment?.id)
      .pipe(
        finalize(() => {
          investment.loading = false;
        })
      )
      .subscribe({
        next: (_response) => {
          toastr.success('Boletos gerados com sucesso.');
        },
        error: (_error) => {
          toastr.error('Ocorreu um erro ao gerar os boletos.');
        }
      })
  }

}
