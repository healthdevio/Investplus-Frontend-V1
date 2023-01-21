import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-t-chartjs',
  templateUrl: './t-chartjs.component.html',
  styleUrls: ['./t-chartjs.component.css']
})
export class TChartjsComponent implements OnInit, AfterViewInit, OnDestroy {

  myChart = Chart;
  ctx: any;
  id: any;
  yAxesConfigMoney: any;

  @Input() type: string;
  @Input() labels: any;
  @Input() label1: any;
  @Input() label2: any;
  @Input() label3: any;
  @Input() backgroundColor: any;
  @Input() borderColor1: any;
  @Input() borderColor2: any;
  @Input() borderColor3: any;
  @Input() data1: any;
  @Input() data2: any;
  @Input() data3: any;
  @Input() config: any;
  @Input() options: any;
  @Input() borderWidth: any;
  @Input() fill: boolean;
  @Input() yAxes: any;
  @Input() width: number;
  @Input() height: number;

  constructor() { }

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
      datasets: [
        {
          label: $this.label1,
          backgroundColor: $this.backgroundColor,
          borderColor: $this.borderColor1,
          data: $this.data1,
          borderWidth: $this.borderWidth,
          fill: $this.fill
        },
        {
          label: $this.label2,
          backgroundColor: $this.backgroundColor,
          borderColor: $this.borderColor2,
          data: $this.data2,
          borderWidth: $this.borderWidth,
          fill: $this.fill
        },
        {
          label: $this.label3,
          backgroundColor: $this.backgroundColor,
          borderColor: $this.borderColor3,
          data: $this.data3,
          borderWidth: $this.borderWidth,
          fill: $this.fill
        }
      ]
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
        legend: {
          display: false
        },
        animation: {
          animateScale: true,
          animateRotate: true,
          duration: 4000
        },
        tooltips: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(t, d) {
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
                fontSize: 11,
                beginAtZero: true,
                callback: (value, index, values) => {
                    return 'R$ ' + value.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, '$1.');
                }
            }
          }],
          xAxes: [{
            ticks: {
                fontSize: 11
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
}
