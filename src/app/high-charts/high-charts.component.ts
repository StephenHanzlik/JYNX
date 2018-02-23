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
    public options: Object;
    @Input() color: string;
    @Input() coinTicker: string;
    @Input() chartData: Array<any>;

    constructor(private http: Http) {}

    ngOnInit(){
      this.initChart("#36DBA3", [], this.coinTicker);
    }

    ngOnChanges(changes: SimpleChanges){
      console.log(changes);
      if(changes.color)
        this.color = changes.color.currentValue;
      if(changes.chartData)
        this.chartData = changes.chartData.currentValue;
      if(changes.coinTicker)
        this.coinTicker = changes.coinTicker.currentValue;
      this.initChart(this.color, this.chartData, this.coinTicker);
    }

    private initChart(color: string, data: Array<any>, ticker: string): void {
          console.log("data in high charts");
          console.log(data);
          let index: number = 0;
          index = data.length - 1;

          let decimal: number = 2;
          if(data[index][1] <= 1){
            decimal = 4;
          }

            this.options = {
                title : { text : '' },
                chart: {type: 'area'},
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        day: '%e of %b'
                    }
                },
                plotOptions: {
                     area: {
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
                 rangeSelector: {
                    selected: 2
                 },
                series : [{
                    name : ticker,
                    data : data,
                    color: color,
                    tooltip: {
                         pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>${point.y}</b>',
                         valueDecimals: decimal,
                         split: true
                     },
                }]
            };
    }


}
