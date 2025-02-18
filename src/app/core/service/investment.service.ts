import { Injectable } from '@angular/core';
import { Investment } from '../interface/investment';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { UserInvestment } from '../interface/user-investment';

@Injectable()
export class InvestmentService {

  constructor(
    private http: HttpClient
  ) { }

  prefixService = 'investments';

  createInvestment(dataSend: Investment, company: number, round: number): Observable<Investment> {
    return this.http.post<Investment>(`${environment.url_api}/companies/${company}/rounds/${round}/${this.prefixService}`, dataSend);
  }

  createInvestmentRealState(dataSend: Investment, round: number): Observable<Investment> {
    return this.http.post<Investment>(`${environment.url_api}/real-state/rounds/${round}/${this.prefixService}`, dataSend);
  }

  getUserInvestment(round: number, type: any): Observable<UserInvestment> {
    return this.http.get<UserInvestment>(`${environment.url_api}/rounds/${round}/investments?type=${type}`);
  }

  updateStatus(investmentId: number, data: { contractStatus: string, paymentStatus: string }): Observable<any> {
    return this.http.patch<any>(`${environment.url_api}/investments-status/${investmentId}`, data);
  }  

  getInvestment(investment: number): Observable<UserInvestment> {
    return this.http.get<UserInvestment>(`${environment.url_api}/${this.prefixService}/${investment}`);
  }

  generateBillets(investmentId: number){
    return this.http.post(`${environment.url_api}/investments/${investmentId}/billets`, {});
  }

}
