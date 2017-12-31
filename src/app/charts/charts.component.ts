import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CryptoCompareService } from "../crypto-compare.service";
import { COINOBJECTS } from "../static-data/coin-objects";
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
  public cryptoDropDownList: Array<any>;
  //public listForDOM: any;

  constructor(fb: FormBuilder,
  private cryptoCompareService: CryptoCompareService) {
    this.chartForm = fb.group({
        "coinName": ['BTC', Validators.required],
        "coinAmt": ['', Validators.required]
    });

    this.coinName = this.chartForm.controls['coinName'];
    this.coinAmt = this.chartForm.controls['coinAmt'];
  }

  ngOnInit() {
  //this.initCryptoList();//cointains call to API
    this.getDropDownList();
    this.initPieChart();
  }

  private initCryptoList(): any {
    let coinData = <any>{};
    let coinDataKeys = [];
    let cryptoDropDownList = <any>[];
    this.cryptoCompareService.getCryptoList().subscribe((result => {
    coinData = JSON.parse(result._body);
    coinData = coinData.Data;
    coinDataKeys = Object.keys(coinData);
    let fullNameList = [];
    console.log("coinDataKeys : " + coinDataKeys);
    for (let i = 0; i < coinDataKeys.length; i++){
        let websiteUrl = "https://www.cryptocompare.com/";
        coinData[coinDataKeys[i]].Url = websiteUrl.concat(coinData[coinDataKeys[i]].Url);
        fullNameList.push(coinData[coinDataKeys[i]]);
        cryptoDropDownList.push(coinData[coinDataKeys[i]]);
    }
      console.log(JSON.stringify(fullNameList));
      return cryptoDropDownList;
    }));
    return cryptoDropDownList
  }

  private addCoin(form: any): void {
    console.log("form: " + JSON.stringify(form));
    this.initPieChart();


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
  private getDropDownList(): any {
    this.cryptoDropDownList = COINOBJECTS;
  }


}
