import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CompanyCaptable } from '../interface/company-captable';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable()
export class CompanyCaptableService {

  constructor(
    private http: HttpClient
  ) { }

  prefixService = 'companies';

  createCaptable(companyId: number, data: CompanyCaptable): Observable<CompanyCaptable> {
    return this.http.post<any>(`${environment.url_api}/${this.prefixService}/${companyId}/captables`, data);
  }

  getCaptable(companyId: number): Observable<CompanyCaptable> {
    return this.http.get<any>(`${environment.url_api}/captable/${companyId}`);
  }

  updateCaptable(companyId: number, data: CompanyCaptable): Observable<CompanyCaptable> {
    return this.http.put<any>(`${environment.url_api}/captable/${companyId}`, data);
  }

}
