import { Component, OnInit, ViewChild } from '@angular/core';
import {SuiModalService, TemplateModalConfig, ModalTemplate, IPopup} from 'ng2-semantic-ui';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CryptoCompareService } from "../services/crypto-compare/crypto-compare.service";
import { MongoDbService } from "../services/mongo-db/mongo-db.service";
import { ALLCOINDATA } from "../static-data/all-coin-data";
import { COINOBJECTS } from "../static-data/coin-objects";


export interface IContext {
    data:string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
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
      public totalPortfolioNotSelected: boolean = false;
      public masterPortfolioDataArray: Array<any> = [];
      public portfolioTotalArray: any = [];
      public portfolioName: string = '';
      public externalMasterPortGraphArray: any = [];
      public currentPortfolioData: any = [];
      public historicPortfolio: any;
      public snapshotMasterList: any = {};
      public totalPortfolioHistoricalData: any = [];
      public totalPortfolioHistoricalDataObj: any = {};
      public coinsGraphHistoryObj: any = {};

      color = "#36DBA3";
      coinTicker = "Total";
      chartData = [];

      constructor(private fb: FormBuilder,
                  private modalService:SuiModalService,
                  private mongoDbService:MongoDbService,
                  private cryptoCompareService: CryptoCompareService) {
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

          this.portfolioName = result[0]['portfolioName'];

          this.historicPortfolio = result;
          let currentPortfolio: any = {};

          currentPortfolio = result[0].coins;
          let currentPortfolioKeys: Array<string> = Object.keys(currentPortfolio);

          if(currentPortfolioKeys.length > 0 && currentPortfolioKeys[0] !== "no ticker"){
            this.cryptoCompareService.getMultiFullPrice(currentPortfolioKeys.join()).subscribe(result=>{
                apiData = JSON.parse(result._body);
                apiData = apiData.RAW;

                let keys: Array<string> = [];
                let allCoinData: object = ALLCOINDATA[0];
                let iterable: number = 0;
                if(apiData)
                  keys = Object.keys(apiData);
                else
                  return;
                let index = 0;
                let keysCounter = 0;

                keys.forEach(key=> {
                  keysCounter++;
                  let coinToAdd = {
                     coinColor: colorsArray[iterable],
                     coinColorName: colorNamesArray[iterable],
                     coinTicker: key,
                     coinAmt: currentPortfolio[key],
                     coinName: allCoinData[key].CoinName,
                     coinPrice: this.addCommas(apiData[key]['USD']['PRICE'] * currentPortfolio[key]),
                     coin24Percent: Math.round(apiData[key]['USD']['CHANGEPCT24HOUR'] * 100)/100,
                     coin24Open: parseInt(apiData[key]['USD']['OPEN24HOUR'], 10),
                     notSelected: true,
                    }

                    if(iterable < colorsArray.length)
                      iterable++;
                    else
                      iterable = 0;

                    this.cardsContent.push(coinToAdd);

                    this.totalPortfolioValue = this.totalPortfolioValue + apiData[key]['USD']['PRICE'] * currentPortfolio[key];

                    this.totalPortfolioValue24hr = this.totalPortfolioValue24hr + apiData[key]['USD']['OPEN24HOUR'] * currentPortfolio[key];

                    //totol profolio price data
                    index++;
                    let that = this;
                    that.currentPortfolioData = [];

                    setTimeout(function(){

                        that.cryptoCompareService.getHistoricalPrice(key).subscribe(result=>{
                          if(result._body){

                            result = JSON.parse(result._body);
                            result = result.Data;
                            let dataObjectToPush = {};
                            dataObjectToPush[key] = result;

                            that.currentPortfolioData.push(dataObjectToPush);

                            that.snapshotMasterList[key] = key;

                            that.historicPortfolio.forEach(portfolioSnapshot => {

                            let snapshotKeys = Object.keys(portfolioSnapshot.coins);
                            let snapshotKeysCounter = 0;

                            snapshotKeys.forEach(snapKey => {

                              snapshotKeysCounter++;

                              if(!that.snapshotMasterList[snapKey]){
                                that.snapshotMasterList[snapKey] = snapKey;
                              }
                            });
                          });// end of for forEach
                          }
                        });//end of multi subscribe
                    }, 375 * index);
                })

                let change: number = this.totalPortfolioValue24hr - this.totalPortfolioValue;

                let percChange: any = (change / this.totalPortfolioValue) *
                 100;

                percChange = percChange.toString();

                this.totalPortfolioValue24hr = Math.round(percChange * 100)/100;

                this.totalPortfolioValue = this.addCommas(this.totalPortfolioValue);
                // let that = this;
                // setTimeout(function(){
                //   that.processHistorcalList();
                // }, 500);
            })
          }
        });
      }

      // private processHistorcalList(): void {
      //   let that = this;
      //  setTimeout(function(){
      //
      //     let snapShotMasterKeys = Object.keys(that.snapshotMasterList);
      //     that.totalPortfolioHistoricalData = that.currentPortfolioData;
      //
      //     let currentPortfolioDataCheckObj = {};
      //
      //     for(var tickerData in that.currentPortfolioData){
      //
      //       currentPortfolioDataCheckObj[Object.keys(that.currentPortfolioData[tickerData])[0]] = Object.keys(that.currentPortfolioData[tickerData])[0];
      //     }
      //
      //     for(var index in snapShotMasterKeys){
      //
      //         if(!currentPortfolioDataCheckObj[snapShotMasterKeys[index]]){
      //
      //           let query = snapShotMasterKeys[index];
      //
      //             that.cryptoCompareService.getHistoricalPrice(query).subscribe(result =>{
      //
      //               result = JSON.parse(result._body);
      //               let pushObj = {}
      //               pushObj[query] = result.Data;
      //
      //               that.totalPortfolioHistoricalData.push(pushObj);
      //             });
      //         }
      //     };
      //
      //   }, 1500)
      //
      //   setTimeout(function(){
      //     for(let obj of that.totalPortfolioHistoricalData){
      //
      //       let key = Object.keys(obj)[0];
      //       that.totalPortfolioHistoricalDataObj[key] = obj[key];
      //     }
      //
      //     that.getHistoricalPorfolioPrice();
      //   }, 2000)
      //
      // }

      // private getHistoricalPorfolioPrice(): void {
      //
      //   this.historicPortfolio = this.historicPortfolio.reverse();
      //   this.coinsGraphHistoryObj = {}
      //
      //   console.log("this.historicPortfolio");
      //   console.log(this.historicPortfolio);
      //
      //   for(let historicItem of this.historicPortfolio){
      //
      //     for(let coinName in historicItem.coins){
      //       this.coinsGraphHistoryObj[coinName] = [];
      //
      //       let coinCounter = 1;
      //
      //       for(let dataPoint of this.totalPortfolioHistoricalDataObj[coinName]){
      //         coinCounter++
      //         // console.log(coinCounter);
      //         // console.log( this.totalPortfolioHistoricalDataObj[coinName].length);
      //         // console.log("this.totalPortfolioHistoricalDataObj[coinName]");
      //         //console.log(this.totalPortfolioHistoricalDataObj[coinName]);
      //         // console.log("dataPoint.time");
      //         // console.log(dataPoint)
      //         // console.log("historicItem.endTime");
      //         // console.log(historicItem.endTime)
      //         if(dataPoint.time <= historicItem.endTime && dataPoint.time >= historicItem.startTime){
      //               let pushArr = []
      //               let usdAmount = dataPoint.close * historicItem.coins[coinName];
      //
      //               pushArr = [dataPoint.time, usdAmount];
      //               console.log("pushArr");
      //               console.log(pushArr);
      //               if(this.coinsGraphHistoryObj[coinName].length > 0){
      //                 if(this.coinsGraphHistoryObj[coinName].reverse()[0] !== dataPoint.time){
      //                   this.coinsGraphHistoryObj[coinName].push(pushArr);
      //                 }
      //               }
      //               else{
      //                 this.coinsGraphHistoryObj[coinName].push(pushArr);
      //               }
      //
      //         }else if (this.coinsGraphHistoryObj[coinName].length < 1 && coinCounter <= this.totalPortfolioHistoricalDataObj[coinName].length){
      //
      //           let pushArr = []
      //           let usdAmount = this.totalPortfolioHistoricalDataObj[coinName][this.totalPortfolioHistoricalDataObj[coinName].length - 1].close * historicItem.coins[coinName];
      //
      //           if(this.coinsGraphHistoryObj[coinName].length > 0){
      //             if(this.coinsGraphHistoryObj[coinName].reverse()[0] !== dataPoint.time){
      //               pushArr = [this.totalPortfolioHistoricalDataObj[coinName][this.totalPortfolioHistoricalDataObj[coinName].length - 1].time, usdAmount];
      //             }
      //           }else{
      //             pushArr = [this.totalPortfolioHistoricalDataObj[coinName][this.totalPortfolioHistoricalDataObj[coinName].length - 1].time, usdAmount];
      //           }
      //
      //
      //           // console.log("this.totalPortfolioHistoricalDataObj");
      //           // console.log(this.totalPortfolioHistoricalDataObj);
      //           // console.log("this.totalPortfolioHistoricalDataObj[coinName].length - 1")
      //           // console.log(this.totalPortfolioHistoricalDataObj[coinName].length - 1)
      //           // console.log("historicItem.coins");
      //           // console.log(historicItem.coins);
      //           console.log("pushArr 2");
      //           console.log(pushArr);
      //
      //           this.coinsGraphHistoryObj[coinName].push(pushArr);
      //         }
      //       }
      //      }
      //   }
      //
      //   console.log("this.coinsGraphHistoryObj");
      //   console.log(this.coinsGraphHistoryObj);
      //
      // }

      public chartCardData(cardTicker: string, cardColor: string): void {
        let changedArray = [];
        this.color = cardColor;
        this.cryptoCompareService.getHistoricalPrice(cardTicker).subscribe(result=>{
          result = JSON.parse(result._body);
          result.Data.forEach(result=>{
            let dataArray = [];
            if(result.close > 0 && result.open > 0){
              dataArray.push(result.time * 1000);
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
        let that  = this;
            this.mongoDbService.addCoin(form).subscribe(result=>{
              setTimeout(function(){
                that.cardsContent = [];
                that.totalPortfolioValue = 0;
                that.getUserCoinData();
              }, 300)
            });
      }

      public deleteCoin(form: any): void {
        this.cardsContent = [];
        this.totalPortfolioValue = 0;

        this.mongoDbService.deleteCoin(form).subscribe(result=>{

          this.getUserCoinData();
        });
      }


    public cardStyleToggle(coin: any, allCoins: any): void {
      allCoins.forEach(loopCoin=>{
        if(loopCoin.coinTicker === coin.coinTicker)
          loopCoin.notSelected = false;
        else
          loopCoin.notSelected = true;
      })
      this.totalPortfolioNotSelected = true;
    }

    public totalPortfolioToggle(allCoins: any): void {
      this.color = "#30D699";
      this.totalPortfolioNotSelected = false;
      this.chartData = this.externalMasterPortGraphArray;

      allCoins.forEach((loopCoin, index)=>{
          loopCoin.notSelected = true;
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
