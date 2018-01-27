import { Component, Input, OnInit, AfterViewInit, OnChanges, SimpleChange } from '@angular/core';
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
      this.initChart("colorString");
    }

    ngOnChanges(changes: {string: SimpleChange}){
      console.log("changes occured!!! " +  changes);
    }

    private initChart(color: string): void {
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
                    color: this.chartColor,
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
