import { AuthService } from './../core/service/auth.service';
import { Observable } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Callback, CognitoUtil } from '../core/service/cognito/cognito.service';
import { environment } from '../../environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  getSessionLoad: boolean;
  idToken: any;
  company: any;

  constructor(
    private inj: Injector
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const $this = this;
    const requestUrl: Array<any> = request.url.split('/');
    const apiUrl: Array<any> = environment.url_api.split('/');
    const cognitoUtil = this.inj.get(CognitoUtil);
    const cognitoUser = cognitoUtil.getCurrentUser();
    if (cognitoUser != null) {
      cognitoUser.getSession(function(err, session) {
        if (session.isValid() === true && session.isValid() != null) {
          $this.idToken = session.getIdToken().getJwtToken();
          // if ($this.idToken && (requestUrl[2] === apiUrl[2])) {
          //   const newRequest = request.clone({ setHeaders: {'Authorization': `${$this.idToken}`}});
          //   return next.handle(newRequest);
          // } else {
          //   return next.handle(request);
          // }
        } else {
          return next.handle(request);
        }
      });
    }
    if ($this.idToken && (requestUrl[2] === apiUrl[2])) {
      const newRequest = request.clone({ setHeaders: {'Authorization': `${$this.idToken}`}});
      return next.handle(newRequest);
    } else {
      return next.handle(request);
    }
    // else {
    //   return next.handle(request);
    // }
    // if ($this.idToken && (requestUrl[2] === apiUrl[2])) {
    //   // console.log($this.idToken);
    //   const newRequest = request.clone({ setHeaders: {'Authorization': `${$this.idToken}`}});
    //   return next.handle(newRequest);
    // } else {
    //   return next.handle(request);
    // }

  }
}
