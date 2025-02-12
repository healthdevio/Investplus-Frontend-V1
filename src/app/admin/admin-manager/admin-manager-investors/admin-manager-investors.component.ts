import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  investors: any[] = [];
  totalInvestors: number;
  actualTotalInvestors: number = 0;
  status = 'PENDING_EVALUATION';
  loader: boolean = true;
  totalPages: number;
  textRegister = 'Nenhum registro encontrado.';
  currentPage = 1;
  itemsPerPage = 10;
  responsive = true;
  labels: any = {
    previousLabel: 'Anterior',
    nextLabel: 'Próximo'
  };

  constructor(
    private investorService: InvestorService, 
    private excelService: ExcelService, 
    private data: TitleService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getAllInvestors();
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;

    this.loader = true;
    this.investorService.getAllUsers(page - 1, this.itemsPerPage).subscribe(
      (response) => {
        this.investors = response.content;
        this.currentPage = page;
        this.totalPages = response.totalPages;
        this.loader = false;
        this.cdr.detectChanges(); // Força a detecção de mudanças
        console.log('Investidores carregados:', this.investors); // Verifique os dados no console
      },
      (error) => {
        console.error('Erro ao mudar de página:', error);
        this.loader = false;
      }
    );
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.getAllInvestors();
  }

  getPaginationRange(totalPages: number): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 3;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (this.currentPage > totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  }

  getAllInvestors() {
    this.loader = true;
    this.data.currentMessage.subscribe(titles => this.titleHeader = titles);
    this.titleHeader.title = 'Administração / Base de Investidores';
    this.data.changeTitle(this.titleHeader);

    this.investorService.getAllUsers(0, this.itemsPerPage).subscribe(
      (response) => {
        this.totalPages = response.totalPages;
        this.totalInvestors = response.totalElements;
        this.investors = response.content;
        this.actualTotalInvestors = response.totalElements;
        this.loader = false;
        this.cdr.detectChanges(); // Força a detecção de mudanças
        console.log('Investidores carregados:', this.investors); // Verifique os dados no console
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