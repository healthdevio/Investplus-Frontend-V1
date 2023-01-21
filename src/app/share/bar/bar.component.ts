import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  OnDestroy
} from '@angular/core';
import {
  Chart
} from 'chart.js';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent implements OnInit, AfterViewInit, OnDestroy {

  myChart = Chart;
  id: any;

  @Input() type: string;
  @Input() data: any;
  @Input() options: any;
  @Input() width: number;
  @Input() height: number;
  @Input() nChart: String;

  constructor() { }

  ngOnInit() {
    this.id = 'myChart' + this.nChart;
  }

  ngAfterViewInit() {
    this.dashboard();
  }

  ngOnDestroy() {
    this.myChart.destroy();
  }

  dashboard() {
    this.myChart = new Chart(this.id, {
      type: this.type,
      data: this.data,
      options: this.options
    });
  }

}
