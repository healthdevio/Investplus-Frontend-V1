import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { CognitoUtil } from '../core/service/cognito/cognito.service';
import { RedirectService } from '../core/service/redirect.service';

declare var toastr: any;

@Injectable()
export class AuthGuard implements CanLoad, CanActivate, CanActivateChild {

    constructor(
        private router: Router,
        private cognitoUtil: CognitoUtil,
        private redirectService: RedirectService,
    ) { }

    private getUrlToRedirect(route: ActivatedRouteSnapshot | Route, stateUrl?: string): string {
        // A `stateUrl` vinda do `canActivate` é a URL mais completa e confiável.
        if (stateUrl) {
            return stateUrl;
        }
        // Para o `canLoad`, usamos um "type guard" para acessar `path` com segurança.
        if ('path' in route && route.path) {
            return `/${route.path}`;
        }
        // Como último recurso, redirecionamos para uma rota padrão segura.
        return '/admin';
    }

    private checkLoginAndPermissions(route: ActivatedRouteSnapshot | Route, stateUrl?: string): Promise<boolean> {
        return new Promise((resolve) => {
            const redirectUrl = this.getUrlToRedirect(route, stateUrl);
            const cognitoUser = this.cognitoUtil.getCurrentUser();

            if (cognitoUser == null) {
                this.redirectToLogin(redirectUrl);
                resolve(false);
                return;
            }

            cognitoUser.getSession((err, session) => {
                if (err || !session || !session.isValid()) {
                    toastr.error('Sua sessão expirou, favor entrar novamente');
                    this.redirectToLogin(redirectUrl);
                    resolve(false);
                    return;
                }

                const tokenId = session.getIdToken();
                const scopes = tokenId['payload']['cognito:groups'] || [];

                if (this.canActivateByScope(route, scopes)) {
                    resolve(true);
                } else {
                    toastr.error('Você não tem permissão para acessar esta página.');
                    this.router.navigate(['/admin']);
                    resolve(false);
                }
            });
        });
    }

    private redirectToLogin(url: string) {
        // Evita salvar a URL da própria página de login no serviço de redirect
        if (url && !url.includes('/auth/login')) {
            this.redirectService.setRedirectUrl(url);
        }
        this.router.navigate(['/auth/login']);
    }

    canLoad(route: Route): Promise<boolean> {
        return this.checkLoginAndPermissions(route);
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return this.checkLoginAndPermissions(route, state.url);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.canActivate(route, state);
    }

    private canActivateByScope(route: ActivatedRouteSnapshot | Route, userScopes: string[]): boolean {
        const requiredScopes = route.data?.scopes;

        if (!requiredScopes || requiredScopes.length === 0) {
            return true;
        }

        return requiredScopes.some(scope => userScopes.includes(scope));
    }
}
