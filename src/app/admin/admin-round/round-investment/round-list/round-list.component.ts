import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-round-list',
  templateUrl: './round-list.component.html',
  styleUrls: ['./round-list.component.css']
})
export class RoundListComponent implements OnInit {

  buttonTitle = 'Investir';

  Gustavo = {};

  constructor() { }

  ngOnInit() {
    // this.Gustavo.name = 'testando';
  }

}
