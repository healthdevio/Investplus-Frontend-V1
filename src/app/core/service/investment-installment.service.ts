import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { InvestmentInstallment } from '../interface/investment-installment';

@Injectable()
export class InvestmentInstallmentService {

  constructor(
    private http: HttpClient
  ) { }

  prefixService = 'installment';

  getInstallments(investment: number): Observable<InvestmentInstallment[]> {
    return this.http.get<InvestmentInstallment[]>(`${environment.url_api}/investments/${this.prefixService}/${investment}`);
  }

}
