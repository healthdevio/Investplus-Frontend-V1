import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Scopes } from '../../core/interface/scopes';
import { CognitoUtil } from '../../core/service/cognito/cognito.service';
import { EventEmitterService } from '../../core/service/event-emitter-service.service';
import { Investor } from '../../core/interface/investor';
import { InvestorService } from '../../core/service/investor.service';
import { UserLoginService } from "../../core/service/cognito/user-login.service";

declare var toastr: any;

@Component({
  selector: 'app-admin-left-side',
  templateUrl: './admin-left-side.component.html',
  styleUrls: ['./admin-left-side.component.css']
})
export class AdminLeftSideComponent implements OnInit {
  @Output() sidebarToggle = new EventEmitter<boolean>();
  showDiv1: boolean = true;
  scopes = new Scopes;
  scopesUser = [];
  investor: Investor;
  base64textString = '';
  activeButton: string = 'start';
  isCollapsed = false;

  isSvgRotated = false;
  isSvgRotatedImportated = false;

  enterpriseSubItens = [
    {
      name: 'Cadastrar empresas',
      link: '/admin/rounds/approval',
      isExpanded: false
    },
    {
      name: 'Atualizações',
      link: null,
      subCategory: [
        {
          name: 'Dados gerais',
          link: '/admin/rounds/approval',
        },
        {
          name: 'Valutation',
          link: '/admin/rounds/company/valuation',
        },
        {
          name: 'Captable',
          link: '/admin/rounds/company/captable',
        },
        {
          name: 'Receita e despesa',
          link: '/admin/rounds/company/financial',
        },
        {
          name: 'Administradores',
          link: '/admin/rounds/company/admin',
        },
        {
          name: 'Equipe Executiva',
          link: '/admin/rounds/company/team',
        },
        {
          name: 'Quadro societário',
          link: '/admin/rounds/company/partners',
        },
      ],
      isExpanded: false
    }
  ];

  importatedSubItens = [
    {
      name: 'Criar Rodada',
      link: '/admin/rounds/incorporator/create',
      isExpanded: false
    },
    {
      name: 'Publicar Rodada',
      link: '/admin/rounds/approval/incorporator/publish',
      isExpanded: false
    },
    {
      name: 'Atualizar Rodada',
      link: '/admin/rounds/approval/company/publish',
    }
  ];

  toggleSvgRotation(): void {
    this.isSvgRotated = !this.isSvgRotated;
  }

  toggleSvgRotationImportated(): void {
    this.isSvgRotatedImportated = !this.isSvgRotatedImportated;
  }

  toggleSubItems(item): void {
    item.isExpanded = !item.isExpanded;
  }

  constructor(
    private cognitoUtil: CognitoUtil,
    private eventEmitter: EventEmitterService,
    private investorService: InvestorService,
    private userService: UserLoginService,
  ) { }

  ngOnInit() {
    const $this = this;
    const cognitoUser = this.cognitoUtil.getCurrentUser();
    if (cognitoUser != null) {
      cognitoUser.getSession(function(err, session) {
        if (session.isValid()) {
          const tokenId = session.getIdToken();
          const cognitoGroups = tokenId['payload']['cognito:groups'];
          cognitoGroups.forEach(element => {
            $this.scopesUser[element] = true;
          });
        }
      });
    }
    Object.assign(this.scopes, this.scopesUser);
    this.getUser();
  }

  getUser() {
    this.eventEmitter.emitter.subscribe((response) => {
      if (response.name === 'get.user') {
        this.investor = response.data;
      }
    });

    // this.investorService.getUser().subscribe((response) => {
    //   this.base64textString = response.avatar === undefined ? './../../../assets/img/default-profile_01.png' : 'data:image/png;base64,' + response.avatar;
    // });
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

    toastr.success('Em desenvolvimento');
  }


  setActiveButton(buttonType: string) {
    this.activeButton = buttonType;
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleDivs() {
    this.showDiv1 = !this.showDiv1;
    this.sidebarToggle.emit(this.showDiv1);
  }


  logout() {
    this.userService.logout();
    window.location.href = "/auth/login";
  }
}
