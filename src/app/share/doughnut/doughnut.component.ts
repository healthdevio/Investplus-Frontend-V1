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
  selector: 'app-doughnut',
  templateUrl: './doughnut.component.html',
  styleUrls: ['./doughnut.component.css']
})
export class DoughnutComponent implements OnInit, AfterViewInit, OnDestroy {

  myChart = Chart;
  id: any;

  @Input() type: string;
  @Input() labels: any;
  @Input() label: any;
  @Input() borderColor: any;
  @Input() backgroundColor: any;
  @Input() data: any;
  @Input() options: any;
  @Input() width: number;
  @Input() height: number;
  @Input() nChart: String;

  constructor() {}

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
    console.log('[type] ', this.type);
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
        backgroundColor: $this.backgroundColor,
        borderColor: $this.borderColor
        // borderColor: $this.borderColor
      }]
    };
    const data = dataset;
    return data;
  }
}
