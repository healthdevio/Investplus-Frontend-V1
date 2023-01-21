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
  selector: 'app-radar',
  templateUrl: './radar.component.html',
  styleUrls: ['./radar.component.css']
})
export class RadarComponent implements OnInit, AfterViewInit, OnDestroy {

  myChart = Chart;
  id: any;

  @Input() type: string;
  @Input() labels: any;
  @Input() label: any;
  @Input() borderColor: any;
  @Input() data: any;
  @Input() options: any;
  @Input() borderWidth: any;
  @Input() width: number;
  @Input() height: number;

  constructor() {}

  ngOnInit() {
    this.id = 'myChart' + new Date().getTime();
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
      data: this.dataDashboard(),
      options: this.options
    });
  }

  dataDashboard() {
    const $this = this;
    const dataset = {
      labels: $this.labels,
      datasets: [{
        label: $this.label,
        data: $this.data,
        borderWidth: $this.borderWidth,
        borderColor: $this.borderColor
      }]
    };
    const data = dataset;
    return data;
  }
}
