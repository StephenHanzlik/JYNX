import { Component, OnInit, ViewChild } from '@angular/core';
import {SuiModalService, TemplateModalConfig, ModalTemplate, IPopup} from 'ng2-semantic-ui';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CryptoCompareService } from "../services/crypto-compare/crypto-compare.service";
import { JynxPriceService } from "../services/jynx-price/jynx-price.service";
import { MongoDbService } from "../services/mongo-db/mongo-db.service";
import { ALLCOINDATA } from "../static-data/all-coin-data";
import { COINOBJECTS } from "../static-data/coin-objects";


export interface IContext {
    data:string;
}

@Component({
  selector: 'app-sharable-portfolio',
  templateUrl: './sharable-portfolio.component.html',
  styleUrls: ['./sharable-portfolio.component.css']
})
export class SharablePortfolioComponent implements OnInit {
  @ViewChild('modalAddTemplate')
  public modalAddTemplate:ModalTemplate<IContext, string, string>
  @ViewChild('modalDeleteTemplate')
  public modalDeleteTemplate:ModalTemplate<IContext, string, string>

  newCoinForm: FormGroup;
  coinName: AbstractControl;
  coinAmt: AbstractControl;

  public cryptoDropDownList: any = [];
  public cardsContent: any = [];
  public coinsToQuery: any = [];
  public totalPortfolioValue: any = 0;
  public totalPortfolioValue24hr: any = 0;
  public totalPortfolioPercentageChange: any;
  public portfolioTotalArray: any = [];
  public portfolioName: string = '';

  color = "#36DBA3";
  coinTicker = "Total";
  chartData = [];
  pointStart = 1234;

  constructor(private fb: FormBuilder,
              private modalService:SuiModalService,
              private mongoDbService:MongoDbService,
              private cryptoCompareService: CryptoCompareService,
              private jynxPriceService: JynxPriceService) {
    this.newCoinForm = fb.group({
        "coinName": ['BTC', Validators.required],
        "coinAmt": ['', Validators.required]
    });

    this.coinName = this.newCoinForm.controls['coinName'];
    this.coinAmt = this.newCoinForm.controls['coinAmt'];
  }

  ngOnInit() {
    this.getDropDownList();
    this.getUserCoinData();
  }

  private getUserCoinData(): void {
    let apiData: any = {};
    let usdAmt: number = 0;
    let colorsArray: Array<string> = ['#828A95', '#C98686', '#3C7A89', '#C9B1BD', '#81AE9D'];
    let colorNamesArray: Array<string> = ['color1', 'color2', 'color3', 'color4', 'color5'];

    this.mongoDbService.getUserPortfolio().subscribe(result=>{
      result = JSON.parse((<any>result)._body);
      result = result[0];
      let aggregateTotalsObj: any = {};
      let coinAmts: Array<number> = result['coinAmts'];
      let coins: Array<string> = result['coins'];
      this.portfolioName = result['portfolioName'];
      for (let l = 0; l < coins.length; l++) {
        if(aggregateTotalsObj[coins[l]])
          aggregateTotalsObj[coins[l]] = aggregateTotalsObj[coins[l]] + coinAmts[l];
        else
          aggregateTotalsObj[coins[l]] = coinAmts[l];
      }

      if(coins.length > 0){

        // this.jynxPriceService.getPrices().subscribe(result =>{
        //   apiData = JSON.parse(result._body);
        //   let portfolioKeys: Array<any> = [];
        //   let allCoinData: object = ALLCOINDATA[0];
        //   let iterable: number = 0;
        //   if(apiData)
        //     portfolioKeys = Object.keys(aggregateTotalsObj);
        //   else
        //     return;
        //
        //   apiData.forEach(key=>{
        //     for(let t = 0; t < portfolioKeys.length; t++){
        //
        //       if(portfolioKeys[t] === key.symbol){
        //         console.log(key);
        //         let coinToAdd = {
        //            coinColor: colorsArray[iterable],
        //            coinColorName: colorNamesArray[iterable],
        //            coinTicker: key.symbol,
        //            coinName: key.name,
        //            coinPrice: this.addCommas(parseInt(key.price_usd, 10)),
        //            coin24Percent: Math.round(key.percent_change_24h * 100)/100,
        //           // coin24Open: parseInt(apiData[key]['USD']['OPEN24HOUR'], 10)
        //           }
        //
        //         this.cryptoCompareService.getSinglePrice(coinToAdd.coinTicker).subscribe(result=>{
        //             console.log("cryptocompare result");
        //             console.log(result);
        //         });
        //
        //           if(iterable < colorsArray.length)
        //             iterable++;
        //           else
        //             iterable = 0;
        //
        //           this.cardsContent.push(coinToAdd);
        //
        //           // this.totalPortfolioValue = this.totalPortfolioValue + apiData[key]['USD']['PRICE'] * aggregateTotalsObj[key];
        //           //
        //           // this.totalPortfolioValue24hr = this.totalPortfolioValue24hr + apiData[key]['USD']['OPEN24HOUR'] * aggregateTotalsObj[key];
        //       }
        //
        //     }
        //
        //
        //   })
        //
        // });

        this.cryptoCompareService.getMultiFullPrice(Object.keys(aggregateTotalsObj).join()).subscribe(result=>{
            apiData = JSON.parse(result._body);
            apiData = apiData.RAW;
            let keys: Array<string> = [];
            let allCoinData: object = ALLCOINDATA[0];
            let iterable: number = 0;
            if(apiData)
              keys = Object.keys(apiData);
            else
              return;
            keys.forEach(key=> {
              let coinToAdd = {
                 coinColor: colorsArray[iterable],
                 coinColorName: colorNamesArray[iterable],
                 coinTicker: key,
                 coinName: allCoinData[key].CoinName,
                 coinPrice: this.addCommas(parseInt(apiData[key]['USD']['PRICE'], 10) * aggregateTotalsObj[key]),
                 coin24Percent: Math.round(apiData[key]['USD']['CHANGEPCT24HOUR'] * 100)/100,
                 coin24Open: parseInt(apiData[key]['USD']['OPEN24HOUR'], 10)
                }

                if(iterable < colorsArray.length)
                  iterable++;
                else
                  iterable = 0;

                this.cardsContent.push(coinToAdd);

                this.totalPortfolioValue = this.totalPortfolioValue + apiData[key]['USD']['PRICE'] * aggregateTotalsObj[key];

                this.totalPortfolioValue24hr = this.totalPortfolioValue24hr + apiData[key]['USD']['OPEN24HOUR'] * aggregateTotalsObj[key];
            })

            let change: number = this.totalPortfolioValue24hr - this.totalPortfolioValue;

            let percChange: any = (change / this.totalPortfolioValue) *
             100;

            percChange = percChange.toString();

            this.totalPortfolioValue24hr = Math.round(percChange * 100)/100;

            this.totalPortfolioValue = this.addCommas(this.totalPortfolioValue);
        })
      }


    });
  }

  private getHistoricalPorfolioPrice(): void {
    //need a function to pass through coins tickers
  }

  public chartCardData(cardTicker: string, cardColor: string): void {
    // console.log("chart card data ran")
    let changedArray = [];
    this.color = cardColor;
    this.cryptoCompareService.getHistoricalPrice(cardTicker).subscribe(result=>{
      result = JSON.parse(result._body);
      console.log("api data w/ 2000 and getALL")
      console.log(result.Data);
      result.Data.forEach(result=>{
        let dataArray = [];
        if(result.close > 0 && result.open > 0){
          dataArray.push(result.time);
          dataArray.push(result.close);
          changedArray.push(dataArray);
        }
      });
      this.chartData = changedArray;
      this.coinTicker = cardTicker;
    });
  }

  private addCommas(usdValue: any): string {
    usdValue = usdValue.toString();
    var parts = usdValue.split('.');
    var part1 = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var part2 = parts[1];
    if(part2){
      var l = part2.length;
      if (l > 2) {
        var p = Number(String(part2).slice(0,3)) / 10;
        part2 = Math.ceil(p) + '';
        while(part2.length < l) {
          part2 += '0';
        }
      if(part1 == "0" && part2[0] == "0")
        part2 = Number(part2.substring(0,3));
      else if(part1 == "0" && part2[0] !== "0")
        part2 = Number(part2.substring(0,2));
      else if(part1 == "0" && part2[1] == "0")
          part2 = Number(part2.substring(0,4));
      else if(part1 == "0" && part2[3] == "0")
          part2 = Number(part2.substring(0,5));
      else{
        if(part2.length < 1)
          part2 + "0";
        part2 = Number(part2.substring(0,2));
      }
      }
      return part1.concat('.' + part2);
    }
    else
      return part1;
  }

  public addCoin(form: any): void {

    this.cardsContent = [];
    this.totalPortfolioValue = 0;

        this.mongoDbService.addCoin(form).subscribe(result=>{
          //console.log("Get User Coin Data about to be called");
          this.getUserCoinData();
        });
  //  })
  }

  public deleteCoin(form: any): void {
    this.cardsContent = [];
    this.totalPortfolioValue = 0;

    this.mongoDbService.deleteCoin(form).subscribe(result=>{
    //  console.log("result of add coin from mongo db service");
      this.getUserCoinData();
    });
  }

  // private updateCards(newCoin: any, usdAmt: number): void {
  //     let allCoinData = ALLCOINDATA;
  //     let newCardData: any = {};
  //     newCardData.qty = Number.parseInt(newCoin.coinAmt);
  //     newCardData.asset = allCoinData[0][newCoin.coinName].FullName;
  //     newCardData.lastPrice = usdAmt;
  //     newCardData.usdValue = newCardData.lastPrice * newCardData.qty
  //     this.cardsContent.push(newCardData);
  // }

  private getDropDownList(): void {
    this.cryptoDropDownList = COINOBJECTS;
  }

  public openAddModal(dynamicContent:string = "Example") {
    const config = new TemplateModalConfig<IContext, string, string>(this.modalAddTemplate);

    config.closeResult = "closed!";
    config.context = { data: dynamicContent };

    this.modalService
        .open(config)
        .onApprove(result => {this.addCoin(result)})
        .onDeny(result => { /* deny callback */});
  }

  public openDeleteModal(dynamicContent:string = "Example") {
    const config = new TemplateModalConfig<IContext, string, string>(this.modalDeleteTemplate);

    config.closeResult = "closed!";
    config.context = { data: dynamicContent };

    this.modalService
        .open(config)
        .onApprove(result => {this.deleteCoin(result)})
        .onDeny(result => { /* deny callback */});
  }

}
