import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Investor } from '../interface/investor';
import { User } from '../interface/user';
import { Investment } from '../interface/investment';

@Injectable()
export class InvestorService {

  constructor(
    private http: HttpClient
  ) { }

  prefixService = 'investors';

  saveUserInvestor(datasend: Investor): Observable<Investor> {
    return this.http.post<Investor>(`${environment.url_api}/${this.prefixService}`, datasend);
  }

  getByUserCompletePerfil(id: number): Observable<any> {
    return this.http.get<Investor>(`${environment.url_api}/${this.prefixService}/${id}`);
  }

  updateInvestor(data: Investor): Observable<Investor> {
    return this.http.put<any>(`${environment.url_api}/${this.prefixService}/me`, data);
  }

  getUser(): Observable<any> {
    return this.http.get<any>(`${environment.url_api}/${this.prefixService}/me`);
  }

  updateAvatar(avatar: any): Observable<any> {
    return this.http.patch<any>(`${environment.url_api}/${this.prefixService}/me`, avatar);
  }

  uploadRG(avatar: any): Observable<any> {
    return this.http.patch<any>(`${environment.url_api}/${this.prefixService}/me/rg`, avatar);
  }

  getAllUsers(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${environment.url_api}/admin/investors?page=${page}&size=${size}`);
  }

  getInvestments(params?: any){
    return this.http.get<Investment[]>(`${environment.url_api}/investors/me/investments`, {params: params})
  }

  getContract(id: string){
    return this.http.get<any>(`${environment.url_api}/contract/document/${id}`);
  }

}
