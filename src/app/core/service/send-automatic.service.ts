import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SendAutomaticService {

  constructor(
    private http: HttpClient
  ) { }

  sendInvestor(post: any): Observable<any> {
    return this.http.post<any>(`https://yz5zy6q8g5.execute-api.us-east-1.amazonaws.com/latest/investor`, post);
  }
}
