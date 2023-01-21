import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  // rows = [
  //   { name: 'Austin', gender: 'Male', company: 'Swimlane' },
  //   { name: 'Dany', gender: 'Male', company: 'KFC' },
  //   { name: 'Molly', gender: 'Female', company: 'Burger King' },
  // ];
  // columns = [
  //   { name: 'Name' },
  //   { name: 'Gender' },
  //   { name: 'Company' }
  // ];

  selected = [];

  // @Input() routing: String;
  @Input() header: any;
  @Input() rows: any;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

}
