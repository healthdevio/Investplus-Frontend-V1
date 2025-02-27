import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CompanyPartner } from '../interface/company-partners';


@Injectable()
export class CompanyPartnersService {

  constructor(
    private http: HttpClient
  ) { }

  prefixService = 'companies';

  createPartner(companyId: number, data: CompanyPartner[]): Observable<CompanyPartner[]> {
    return this.http.post<CompanyPartner[]>(
      `${environment.url_api}/${this.prefixService}/${companyId}/partners`,
      data
    );
  }

  getPartner(companyId: number): Observable<CompanyPartner[]> {
    return this.http.get<any>(`${environment.url_api}/companies/${companyId}/partners`);
  }

  updatePartner(companyId: number, data: CompanyPartner): Observable<CompanyPartner> {
    return this.http.put<any>(`${environment.url_api}/partner/${companyId}`, data);
  }

  deletePartner(companyId: number, partnerId: number): Observable<CompanyPartner> {
    return this.http.delete<any>(`${environment.url_api}/companies/${companyId}/partners/${partnerId}`);
  }

}
