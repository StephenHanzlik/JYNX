import { Component, Input, OnInit, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { HttpModule,Http } from '@angular/http';

@Component({
    selector: 'high-chart',
    styles: [`
          chart {
            display: block;
          }`],
    template: `<chart type="StockChart" [options]="options"></chart>`
})
export class HighChartsComponent implements OnInit, OnChanges{
    private options: Object;
    @Input() color: string;
    // private chartColor: string = '';
    //
    // @Input()
    // set color(inputColor: string){
    //   this.chartColor = inputColor;
    // }
    //
    // get color(): string {
    //   return this.chartColor;
    // }

    constructor(private http: Http) {}

    ngOnInit(){
      this.initChart("#36DBA3");
    }

    ngOnChanges(changes: SimpleChanges){
      this.initChart(changes.color.currentValue);
    }

    private initChart(color: string): void {
      console.log("color in initChart: " + color);
      this.http.get('https://cdn.rawgit.com/gevgeny/angular2-highcharts/99c6324d/examples/aapl.json').subscribe(res => {
            this.options = {
                title : { text : 'Your Crypto Portfolio' },
                chart: {type: 'area'},
                plotOptions: {
                     area: {
                         pointStart: 1940,
                         marker: {
                             enabled: false,
                             symbol: 'circle',
                             radius: 2,
                             states: {
                                 hover: {
                                     enabled: true
                                 }
                             }
                         }
                     }
                 },
                series : [{
                    name : 'BTC',
                    data : res.json(),
                    color: color,
                    tooltip: {
                         pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                         valueDecimals: 2,
                         split: true
                     },
                }]
            };
        });
    }


}
