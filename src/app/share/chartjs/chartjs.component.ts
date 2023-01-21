import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import {
  Chart
} from 'chart.js';

@Component({
  selector: 'app-chartjs',
  templateUrl: './chartjs.component.html',
  styleUrls: ['./chartjs.component.css']
})
export class ChartjsComponent implements OnInit, AfterViewInit, OnDestroy {

  myChart = Chart;
  ctx: any;
  id: any;
  yAxesConfigMoney: any;

  @Input() type: string;
  @Input() labels: any;
  @Input() label: any;
  @Input() backgroundColor: any;
  @Input() borderColor: any;
  @Input() data: any;
  @Input() config: any;
  @Input() options: any;
  @Input() borderWidth: any;
  @Input() fill: boolean;
  @Input() yAxes: any;
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
      options: this.optionsDashboard()
    });
  }

  dataDashboard() {
    const $this = this;
    const dataset = {
      labels: $this.labels,
      datasets: [{
        label: $this.label,
        backgroundColor: $this.backgroundColor,
        borderColor: $this.borderColor,
        data: $this.data,
        borderWidth: $this.borderWidth,
        fill: $this.fill
      }]
    };
    const data = dataset;
    return data;
  }

  optionsDashboard() {
    const $this = this;
    let options = new Object();

    if (this.yAxes === 'money') {

      options = {
        responsive: true,
        animation: {
          animateScale: true,
          animateRotate: true
        },
        tooltips: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function (t, d) {
              const xLabel = d.datasets[t.datasetIndex].label;
              const yLabel = t.yLabel;
              return ' R$ ' + yLabel.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, '$1.');
            }
          }
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              callback: (value, index, values) => {
                return 'R$ ' + value.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, '$1.');
              }
            }
          }]
        }
      };
    } else {
      options = {
        responsive: true,
        animation: {
          animateScale: true,
          animateRotate: true
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true
        }
      };
    }
    return options;
  }

  maskMoney(number) {
    if (number == null) {
      return '';
    }
    return 'R$ ' + number.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, '$1.');
  }

}
