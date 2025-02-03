import { Component, OnInit } from '@angular/core';
import { InvestorService } from '../../../core/service/investor.service';
import { ExcelService } from '../../../core/service/excel.service';
import { TitleHeader } from '../../../core/interface/title-header';
import { TitleService } from '../../../core/service/title.service';

@Component({
  selector: 'app-admin-manager-investors',
  templateUrl: './admin-manager-investors.component.html',
  styleUrls: ['./admin-manager-investors.component.css']
})
export class AdminManagerInvestorsComponent implements OnInit {

  titleHeader: TitleHeader;
  investors: any;
  totalInvestors: number;
  actualTotalInvestors: number = 0;
  status = 'PENDING_EVALUATION';
  loader: boolean;
  totalPages: number;
  textRegister = 'Nenhum registro encontrado.';
  p = 1;
  currentPage = 1;
  responsive = true;
  labels: any = {
    previousLabel: 'Anterior',
    nextLabel: 'Próximo'
  };

  constructor(
    private investorService: InvestorService, 
    private excelService: ExcelService, 
    private data: TitleService
  ) {}

  ngOnInit() {
    this.getAllInvestors();
  }

  changePage(page: number) {
    this.loader = true;
    this.investorService.getAllUsers(page, 10).subscribe(
      (response) => {
        this.investors = response.content;
        this.currentPage = page;
        this.loader = false;
      }
    );
  }

  getPaginationRange(totalPages: number): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 3;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      for (let i = 2; i <= maxVisiblePages; i++) {
        pages.push(i);
      }
      if (totalPages > maxVisiblePages + 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  }

  getAllInvestors() {
    this.loader = true;
    this.data.currentMessage.subscribe(titles => this.titleHeader = titles);
    this.titleHeader.title = 'Administração / Base de Investidores';
    this.data.changeTitle(this.titleHeader);

    this.investorService.getAllUsers(0, 100).subscribe(
      (response) => {
        this.totalPages = response.totalPages;
        this.totalInvestors = response.totalElements;
        this.investors = response.content;

        const allInvestors = [...response.content];
        const requests = [];

        for (let page = 1; page < this.totalPages; page++) {
          requests.push(this.investorService.getAllUsers(page, 100).toPromise());
        }

        Promise.all(requests)
          .then((responses) => {
            responses.forEach((res) => {
              allInvestors.push(...res.content);
            });

            this.actualTotalInvestors = allInvestors.length;
            this.loader = false;
          })
          .catch((error) => {
            console.error("Erro ao buscar todas as páginas de investidores:", error);
            this.loader = false;
          });
      },
      (error) => {
        if (error.status === 500) {
          window.location.reload();
        } else {
          this.loader = false;
          console.error('Erro ao buscar investidores:', error);
        }
      }
    );
  }

  unmaskInput(input) {
    if (input === undefined) {
      return input;
    }
    return input.replace(/[^\d]+/g, '');
  }

  unmaskMoney(input) {
    if (input === undefined) {
      return input;
    }
    return (Number(input.replace(/[^\d]+/g, '')) / 100).toFixed(2);
  }

  exportAsXLSX(): void {
    this.loader = true;
    const allInvestors = [];
    
    this.investorService.getAllUsers(0, 100).subscribe(
      (response) => {
        allInvestors.push(...response.content);
  
        const requests = [];
        for (let page = 1; page < this.totalPages; page++) {
          requests.push(this.investorService.getAllUsers(page, 100).toPromise());
        }
  
        Promise.all(requests)
          .then((responses) => {
            responses.forEach((res) => {
              allInvestors.push(...res.content);
            });

            const formattedInvestors = [
              {
                Nome: `Total de investidores: ${this.actualTotalInvestors}`, 
                email: '',
                phone: '',
                cpf: '',
                cnpj: '',
                rg: '',
                investor_profile_statement: '',
                uf: '',
                city: '',
                totalInvestedOthers: '',
                created: ''
              },
              ...allInvestors.map(investor => ({
                Nome: investor.fullName,
                email: investor.email,
                phone: investor.phone,
                cpf: investor.cpf,
                cnpj: investor.cnpj,
                rg: investor.rg,
                investor_profile_statement: investor.investorProfileStatement,
                uf: investor.address?.uf || '',
                city: investor.address?.city || '',
                totalInvestedOthers: investor.totalInvestedOthers > 0 ? 'S' : 'N',
                created: new Date(investor.created).toLocaleDateString('pt-BR'),
              }))
            ];

            this.excelService.exportAsExcelFile(formattedInvestors, 'investors');
            this.loader = false;
          })
          .catch((error) => {
            console.error("Erro ao buscar todos os investidores:", error);
            this.loader = false;
          });
      },
      (error) => {
        console.error("Erro ao buscar a primeira página de investidores:", error);
        this.loader = false;
      }
    );
  }
}
