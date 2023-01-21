import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { CognitoUtil } from '../core/service/cognito/cognito.service';

import { AuthService } from '../core/service/auth.service';
declare var toastr: any;

@Injectable()
export class RouteGuard implements CanLoad, CanActivate, CanActivateChild {

  getSessionLoad: boolean;
  scopes: any;

  constructor(
    private cognitoUtil: CognitoUtil,
    private authService: AuthService,
    private router: Router,
  ) {}

  canLoad(route: any): boolean {
    return this.validateSession(route);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable < boolean > | Promise < boolean > | boolean {
    return this.validateSession(route);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable < boolean > | Promise < boolean > | boolean {
    return this.validateSession(route);
  }

  validateSession(route: any) {
    const $this = this;
    const cognitoUser = this.cognitoUtil.getCurrentUser();
    if (cognitoUser != null) {
      cognitoUser.getSession(function (err, session) {
        if (err) {
          toastr.error('Sua sessão espirou, favor entrar novamente');
          $this.authService.returnLogin();
          return false;
        }
        const tokenId = session.getIdToken();
        const scopes = tokenId['payload']['cognito:groups'];
        if ($this.canActivatedByScope(route, scopes) === false) {
          $this.authService.returnLogin();
          return false;
        }
        $this.getSessionLoad = session.isValid();
      });
      return this.getSessionLoad;
    } else {
      $this.authService.returnLogin();
      $this.getSessionLoad = false;
      return this.getSessionLoad;
    }
  }

  canActivatedByScope(route, scopes): boolean {
    let canActivated = true;
    const permissions = [];
    const NAO_TEM = 0;
    const TEM = 1;
    if (route.data) {
      if (route.data.scopes) {
        if (route.data.scopes.length <= 0) {
          return canActivated;
        }
        route.data.scopes.forEach((scope) => {
          if (scopes.includes(scope)) {
            permissions.push(TEM);
          } else {
            permissions.push(NAO_TEM);
          }
        });
        if (route.data.needAll) {
          if (route.data.needAll === true) {
            if (permissions.indexOf(NAO_TEM) >= 0) {
              canActivated = false;
            }
          } else {
            if (permissions.indexOf(TEM) < 0) {
              canActivated = false;
            }
          }
        } else {
          if (permissions.indexOf(TEM) < 0) {
            canActivated = false;
          }
        }
      }
    }
    return canActivated;
  }

}
