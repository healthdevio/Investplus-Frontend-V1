import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RedirectService {

    private redirectUrl: string | null = null;

    setRedirectUrl(url: string): void {
        this.redirectUrl = url;
    }

    getAndClearRedirectUrl(): string | null {
        const url = this.redirectUrl;
        this.redirectUrl = null;
        return url;
    }
}