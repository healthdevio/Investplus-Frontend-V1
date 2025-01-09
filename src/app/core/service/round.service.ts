import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Round } from "../interface/round";
import { RoundPrototype } from "../interface/round-prototype";
import { Company } from "../interface/company";
import "rxjs/add/operator/map";
import { Rounds } from "../interface/rounds";
import { RealState } from "../interface/real-state";

@Injectable()
export class RoundService {
  constructor(private http: HttpClient) {}

  prefixRound = "rounds";
  prefixCompany = "companies";

  closeRound(roundId: number): Observable<any> {
    return this.http.patch<any>(
      `${environment.url_api}/rounds/${roundId}/finish`,
      {}
    );
  }

  createRound(id: number, data: Round, action: string): Observable<Round> {
    if (action !== "create" && action !== "edit") {
      throw new Error("ação inválida. Deve ser 'criar' ou 'editar'");
    }
  
    return this.http.post<any>(
      `${environment.url_api}/${this.prefixCompany}/${id}/${this.prefixRound}?action=${action}`,
      data
    );
  }  

  getRound(company: number, round: number): Observable<RoundPrototype> {
    return this.http.get<any>(
      `${environment.url_api}/${this.prefixCompany}/${company}/${this.prefixRound}/${round}`
    );
  }

  getRealStateRoundById(roundId: number): Observable<RealState> {
    return this.http.get<any>(
      `${environment.url_api}/public/real-state/rounds/${roundId}`
    );
  }

  getShortRound(company: number, round: number): Observable<RoundPrototype> {
    return this.http.get<any>(
      `${environment.url_api}/${this.prefixCompany}/${company}/short/${this.prefixRound}/${round}`
    );
  }

  getRound2(company: number, round: number): Observable<Rounds> {
    return this.http.get<any>(
      `${environment.url_api}/${this.prefixCompany}/${company}/${this.prefixRound}/${round}`
    );
  }

  getAllByStatus(status: string): Observable<any> {
    return this.http.get<Round>(
      `${environment.url_api}/${this.prefixRound}?status=${status}`
    );
  }

  getAllPublic(): Observable<any> {
    return this.http.get<Round>(
      `${environment.url_api}/public/${this.prefixCompany}/${this.prefixRound}`
    );
  }

  getAllRounds(): Observable<any> {
    return this.http.get<Round>(
      `${environment.url_api}/admin/${this.prefixRound}`
    );
  }

  getAllUser(): Observable<any> {
    return this.http.get<Round>(
      `${environment.url_api}/investors/me/${this.prefixRound}`
    );
  }

  getAllShortUser(): Observable<any> {
    return this.http.get<Round>(
      `${environment.url_api}/investors/me/short/${this.prefixRound}`
    );
  }

  updateStatus(company: number, round: number, data: any): Observable<any> {
    return this.http.patch<any>(
      `${environment.url_api}/${this.prefixCompany}/${company}/${this.prefixRound}/${round}`,
      data
    );
  }

  createToken(token: any): Observable<any> {
    return this.http.post<any>(
      `${environment.url_api}/investors/me/${this.prefixCompany}/exclusive-rounds`,
      token
    );
  }
}
