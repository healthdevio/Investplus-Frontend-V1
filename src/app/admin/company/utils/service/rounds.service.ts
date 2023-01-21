import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserInvestment } from '../../../../core/interface/user-investment';
import { environment } from '../../../../../environments/environment';

@Injectable()
export class RoundsService {

  constructor(
    private http: HttpClient
  ) { }

  prefixService = 'rounds';

  getUserInvestment(round: number): Observable<any> {
    if (round === 1) {
      return this.http.get<UserInvestment>(`${environment.url_api}/${this.prefixService}/${round}/investments?type=REAL_STATE`);
    } else {
      return this.http.get<UserInvestment>(`${environment.url_api}/${this.prefixService}/${round}/investments?type=COMPANY`);
    }
  }

}
