import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Bank } from '../interface/bank';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BankService {

  constructor(
    private http: HttpClient
  ) { }

  getAll(){
    return this.http.get<Bank[]>(`${environment.url_api}/public/banks`, {
      observe: "response"
    });
  }
}
