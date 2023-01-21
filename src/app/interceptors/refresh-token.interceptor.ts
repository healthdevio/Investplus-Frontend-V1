
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { CognitoUtil } from '../core/service/cognito/cognito.service';
import { catchError } from 'rxjs/operators';

declare var bootbox: any;

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {

    idToken: any;

    constructor(
        private injector: Injector,
        private router: Router
    ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // console.log('entrou dentro do inteceptor');

    return next
      .handle(request)
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          const $this = this;
          const cognitoUtil = this.injector.get(CognitoUtil);
          const cognitoUser = cognitoUtil.getCurrentUser();
          if (cognitoUser != null) {
              // console.log('O usuario não esta logado na session');
              cognitoUser.getSession(function(err, session) {
                  if (err) {
                      // console.log('entrou dentro do error do interceptor');
                      cognitoUser.refreshSession(session.getRefreshToken(), (error, result) => {
                          if (error) {
                              $this.router.navigate(['/auth/login']);
                              return observableThrowError(errorResponse);
                          }
                      });
                  }
                  if (session.isValid() === true && session.isValid() != null) {
                      if (session.isValid() === true && session.isValid() != null) {
                          $this.idToken = session.getIdToken().getJwtToken();
                          if ($this.idToken) {
                              const newRequest = request.clone({ setHeaders: {'Authorization': `${$this.idToken}`}});
                              return next.handle(newRequest);
                          } else {
                              return observableThrowError(errorResponse);
                          }
                      } else {
                          return observableThrowError(errorResponse);
                      }
                  }
              });
          } else {
              this.router.navigate(['/auth/login']);
              return observableThrowError(errorResponse);
          }
      })
      )
    }
}
