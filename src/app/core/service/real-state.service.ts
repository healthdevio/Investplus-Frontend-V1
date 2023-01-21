import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RealState } from '../interface/real-state';


@Injectable()
export class RealStateService {

  constructor(
    private http: HttpClient
  ) { }

  prefixRound = 'rounds';
  prefixRealStates = 'real-state';

  createRound(data: RealState): Observable<RealState> {
    return this.http.post<any>(`${environment.url_api}/${this.prefixRealStates}/${this.prefixRound}`, data);
  }

  updateStatus(round: number, data: any): Observable<any> {
    return this.http.patch<any>(`${environment.url_api}/${this.prefixRealStates}/${this.prefixRound}/${round}`, data);
  }

  getRound(round: number): Observable<RealState> {
    return this.http.get<any>(`${environment.url_api}/${this.prefixRealStates}/${this.prefixRound}/${round}`);
  }

  getAllByStatus(status: string): Observable<any> {
    return this.http.get<RealState>(`${environment.url_api}/${this.prefixRound}?status=${status}`);
  }
}
