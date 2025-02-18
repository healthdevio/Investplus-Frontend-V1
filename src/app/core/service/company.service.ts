import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Company } from '../interface/company';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Valuation } from '../interface/valuation';
import { Team } from '../interface/team';

@Injectable()
export class CompanyService {

  constructor(
    private http: HttpClient
  ) { }

  prefixService = 'companies';

  createCompany(data: Company): Observable<Company> {
    return this.http.post<any>(`${environment.url_api}/public/${this.prefixService}`, data);
  }

  updateCompany(id: number, data: Company): Observable<Company> {
    return this.http.put<any>(`${environment.url_api}/${this.prefixService}/${id}`, data);
  }

  updateStatus(id: number, data: any): Observable<any> {
    return this.http.patch<any>(`${environment.url_api}/${this.prefixService}/${id}`, data);
  }

  updateDocs(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${environment.url_api}/${this.prefixService}/${id}/docs`, data);
  }

  getCompany(id: number): Observable<Company> {
    return this.http.get<any>(`${environment.url_api}/${this.prefixService}/${id}`);
  }

  getCompanyIndicators(id: number): Observable<Company> {
    return this.http.get<any>(`${environment.url_api}/${this.prefixService}/${id}/indicators`);
  }

  getAllByStatus(status: string): Observable<any> {
    return this.http.get<Company>(`${environment.url_api}/${this.prefixService}?status=${status}`);
  }
  
  getAllByActiveStatus(status: string): Observable<any> {
    return this.http.get<Company>(`${environment.url_api}/${this.prefixService}-active-status?active=${status}`);
  }

  changeCompanyActiveStatus(id: number): Observable<any> {
    return this.http.patch<Company>(`${environment.url_api}/${this.prefixService}-active-status/${id}`, {});
  }

  getDocsByCompany(id: number): Observable<any> {
    return this.http.get<any>(`${environment.url_api}/${this.prefixService}/${id}/docs`);
  }

  getPartnersByCompany(id: number): Observable<any> {
    return this.http.get<any>(`${environment.url_api}/${this.prefixService}/${id}/partners`);
  }

  getValuation(id: number): Observable<any> {
    return this.http.get<any>(`${environment.url_api}/${this.prefixService}/${id}/valuations`);
  }

  createValuation(id: number, datasend: Valuation): Observable<Valuation> {
    return this.http.post<Valuation>(`${environment.url_api}/${this.prefixService}/${id}/valuations`, datasend);
  }

  createTeam(id: number, datasend: Team[]): Observable<Team> {
    return this.http.post<Team>(`${environment.url_api}/${this.prefixService}/${id}/team`, datasend);
  }

  getTeam(id: number): Observable<Team[]> {
    return this.http.get<Team[]>(`${environment.url_api}/${this.prefixService}/${id}/team`);
  }

  deleteTeamMember(companyId: number, memberId: number): Observable<void> {
    return this.http.delete<void>(`${environment.url_api}/${this.prefixService}/${companyId}/team/${memberId}`);
  }

  createAdmin(id: number, datasend: any): Observable<any> {
    return this.http.post<any>(`${environment.url_api}/${this.prefixService}/${id}/admins`, datasend);
  }

  uploadDocs(id: number, datasend: any){
    return this.http.post<any>(`${environment.url_api}/${this.prefixService}/${id}/documents`, datasend);
  }

  updateTeamMember(companyId: number, teamMemberDTO: Team): Observable<void> {
    return this.http.put<void>(`${environment.url_api}/${this.prefixService}/${companyId}/team`, teamMemberDTO);
  }

}
