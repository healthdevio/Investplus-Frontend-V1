import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Valuation } from '../interface/valuation';

@Injectable()
export class CompanyService {

  constructor(
    private http: HttpClient
  ) { }

  prefixService = 'companies';

  getInvestors(): Observable<any> {
    return this.http.get<any>(`${environment.url_api}/public/${this.prefixService}/rounds`);
  }

  createValuation(datasend: Valuation): Observable<Valuation> {
    return this.http.post<Valuation>(`${environment.url_api}/${this.prefixService}/2/valuations`, datasend);
  }

  getValuation(): Observable<any> {
    return this.http.get<any>(`${environment.url_api}/${this.prefixService}/2/valuations`);
  }

}
