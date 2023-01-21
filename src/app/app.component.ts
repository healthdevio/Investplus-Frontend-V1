import { Component, OnInit } from '@angular/core';

declare var toastr: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor() {
  }

  ngOnInit() {
  }

}
