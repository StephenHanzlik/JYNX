import { Component, OnInit } from '@angular/core';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import * as D3 from "d3";
import 'd3pie';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})

export class ChartsComponent implements OnInit {

  chartForm: FormGroup;
  coinName: AbstractControl;
  coinAmt: AbstractControl;

  private pieChartData: any = {};
  private pieChartContent: Array<any>;

  constructor(fb: FormBuilder) {
    this.chartForm = fb.group({
        "coinName": ['BTC', Validators.required],
        "coinAmt": ['', Validators.required]
    });

    this.coinName = this.chartForm.controls['coinName'];
    this.coinAmt = this.chartForm.controls['coinAmt'];
  }

  ngOnInit() {
    this.initPieChart();
  }

  private addCoin(form: any): void {
    console.log('you submitted value: ', form);


  }

  private initPieChart (): void {
    this.pieChartContent = [{
      "label": "Select a coin to get started",
      "value": 67706,
      "color": "#CEE9F9"
    }];

    this.pieChartData = {
        "header": {
          "title": {
            "text": "",
            "fontSize": 24,
            "font": "open sans"
          },
          "subtitle": {
            "text": "",
            "color": "#999999",
            "fontSize": 12,
            "font": "open sans"
          },
          "titleSubtitlePadding": 9
        },
        "footer": {
          "color": "#999999",
          "fontSize": 10,
          "font": "open sans",
          "location": "bottom-left"
        },
        "size": {
          "canvasWidth": 590,
          "pieOuterRadius": "90%"
        },
        "data": {
          "sortOrder": "value-desc",
          "content": this.pieChartContent
        },
        "labels": {
          "outer": {
            "pieDistance": 32
          },
          "inner": {
            "hideWhenLessThanPercentage": 3
          },
          "mainLabel": {
            "fontSize": 11
          },
          "percentage": {
            "color": "#ffffff",
            "decimalPlaces": 0
          },
          "value": {
            "color": "#adadad",
            "fontSize": 11
          },
          "lines": {
            "enabled": true
          },
          "truncation": {
            "enabled": true
          }
        },
        "effects": {
          "pullOutSegmentOnClick": {
            "effect": "linear",
            "speed": 400,
            "size": 8
          }
        },
        "misc": {
          "gradient": {
            "enabled": true,
            "percentage": 100
          }
        }
      }
      var pie = new d3pie("myPie", this.pieChartData);
  }

  public updatePieChart(newPieChartContent): void {
    this.pieChartContent = newPieChartContent;
    var pie = new d3pie("myPie", this.pieChartData);
  }

  // private createPieChart (pieChartData): void {
  //
  // }


}
