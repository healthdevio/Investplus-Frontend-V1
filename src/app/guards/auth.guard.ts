import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { CognitoUtil, LoggedInCallback } from '../core/service/cognito/cognito.service';
import { UserLoginService } from '../core/service/cognito/user-login.service';

declare var toastr: any;

@Injectable()
export class AuthGuard implements CanLoad, CanActivate, CanActivateChild, LoggedInCallback {

    getSessionLoad: boolean;
    scopes: any;
    loggin: boolean;
    message: string;

    constructor(
        private router: Router,
        private userService: UserLoginService
    ) {
        this.userService.isAuthenticated(this);
    }

    canLoad(route: any): boolean {
        if (this.loggin) {
            return this.loggin;
        } else {
            this.router.navigate(['/auth']);
        }
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this.loggin) {
            return this.loggin;
        } else {
            this.router.navigate(['/auth']);
        }
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this.loggin) {
            return this.loggin;
        } else {
            this.router.navigate(['/auth']);
        }
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (isLoggedIn) {
            this.loggin = isLoggedIn;
            this.router.navigate(['/admin']);
            return this.loggin;
        }
    }

}
