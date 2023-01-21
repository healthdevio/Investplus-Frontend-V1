import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CompanyFinancial } from '../interface/company-financial';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable()
export class CompanyFinancialService {

  constructor(
    private http: HttpClient
  ) { }

  prefixService = 'companies';

  createFinancial(companyId: number, data: CompanyFinancial): Observable<CompanyFinancial> {
    return this.http.post<any>(`${environment.url_api}/${this.prefixService}/${companyId}/financial`, data);
  }

  getFinancial(companyId: number): Observable<CompanyFinancial> {
    return this.http.get<any>(`${environment.url_api}/financial/${companyId}`);
  }

  updateFinancial(companyId: number, data: CompanyFinancial): Observable<CompanyFinancial> {
    return this.http.put<any>(`${environment.url_api}/financial/${companyId}`, data);
  }

}
