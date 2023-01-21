import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

// const userPool = new CognitoUserPool(poolData);

@Injectable()
export class AuthService {

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  prefixService = 'public/users/investors';

  returnLogin() {
    this.router.navigate(['/auth/login']);
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(`${environment.url_api}/${this.prefixService}`, data);
  }

  changePassword(oldPassword: string, newPassword: string, Accesstoken: string) {
    return this.http.patch<any>(`${environment.url_api}/investors/me/password`,
      { oldPassword, newPassword },
      { headers: { Accesstoken } });
  }

}
