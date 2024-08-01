import { Component, OnInit, OnChanges, DoCheck } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, DoCheck {

  showBackArrow: boolean = false;

  constructor(
    private router: Router
  ) { }

  ngDoCheck() {
    this.normalizeHeigth();
  }

  ngOnInit() {
    this.normalizeHeigth();
    
    this.checkCurrentRoute(this.router.url);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkCurrentRoute(event.urlAfterRedirects);
      }
    });
  }

  checkCurrentRoute(url: string): void {
    this.showBackArrow = url.includes('/auth/register');
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  normalizeHeigth() {
    setTimeout(function() {
      document.getElementsByTagName('body')[0].removeAttribute('style');
      document.getElementsByTagName('html')[0].removeAttribute('style');
      $('body').addClass('login-page');
    }, 50);
  }

}
