import { Component, OnInit, OnChanges, DoCheck } from '@angular/core';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, DoCheck {

  constructor(
    private router: Router
  ) { }

  ngDoCheck() {
    this.normalizeHeigth();
  }

  ngOnInit() {
    this.normalizeHeigth();
  }

  normalizeHeigth() {
    setTimeout(function() {
      document.getElementsByTagName('body')[0].removeAttribute('style');
      document.getElementsByTagName('html')[0].removeAttribute('style');
      $('body').addClass('login-page');
    }, 50);
  }

}
