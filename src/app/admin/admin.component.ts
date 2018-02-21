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

          this.portfolioName = result[result.length - 1]['portfolioName'];

          let historicPortfolio: Array<any> = result;
          let currentPortfolio: any = {};
          //get current portfolio status for the cards
          currentPortfolio = result[result.length - 1].coins;
          let currentPortfolioKeys: Array<string> = Object.keys(currentPortfolio);


          if(currentPortfolioKeys.length > 0){
            this.cryptoCompareService.getMultiFullPrice(currentPortfolioKeys.join()).subscribe(result=>{
                apiData = JSON.parse(result._body);
                apiData = apiData.RAW;
                console.log("apiData");
                console.log(apiData);
                let keys: Array<string> = [];
                let allCoinData: object = ALLCOINDATA[0];
                let iterable: number = 0;
                if(apiData)
                  keys = Object.keys(apiData);
                else
                  return;
                let index = 0;
                let snapshotMasterList = {};

                keys.forEach(key=> {
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

                    setTimeout(function(){
                    //  console.log("key")
                      //console.log(key);
                        that.cryptoCompareService.getHistoricalPrice(key).subscribe(result=>{
                          if(result._body){
                            result = JSON.parse(result._body);
                            result = result.Data;

                            snapshotMasterList[key] = true;

                            historicPortfolio.forEach(portfolioSnapshot => {

                            let snapshotKeys = Object.keys(portfolioSnapshot.coins);
                            snapshotKeys.forEach(snapKey => {
                              if(!snapshotMasterList[key]){
                                snapshotMasterList[key] = true;
                              }
                            });

                          //  console.log("master snap shot list:");
                          //  console.log(snapshotMasterList);

                            //  result.forEach(dataPoint => {
                                // if(dataPoint[0] > currentPortfolio.startTime){
                                //
                                // }
                            //  });

                            });


                          }
                        });
                    }, 375 * index);








                    //old total portfolio price data graph
                  //  index++
                  //  let that = this;
                    // setTimeout(function(){
                    //   that.cryptoCompareService.getHistoricalPrice(key).subscribe(result=>{
                    //       if(result._body){
                    //         result = JSON.parse(result._body)
                    //         // let localHistoricalData: Object = {
                    //         //   name: key,
                    //         //   data: result.Data
                    //         // };
                    //         that.masterPortfolioDataArray.push(result.Data);
                    //
                    //         //aggregateTotalsObj[key]
                    //
                    //         if(that.masterPortfolioDataArray.length >= keys.length){
                    //           let flatArray = [].concat.apply([], that.masterPortfolioDataArray);
                    //           let masterPortGraphArray: any = []
                    //           let masterPortGraphData: any = {};
                    //         //  let count = 0;
                    //
                    //           flatArray.forEach(masterEntry=>{
                    //           //  count ++
                    //             if(!masterPortGraphData[masterEntry.time]){
                    //               let newNumb: number = masterEntry.close * currentPortfolio[key];
                    //
                    //               masterPortGraphData[masterEntry.time] = {
                    //                  data: [masterEntry.time * 1000, Math.round(newNumb * 100)/100]
                    //                };
                    //             }
                    //             else if(masterPortGraphData[masterEntry.time]){
                    //                 Math.round(masterPortGraphData[masterEntry.time].data[1] + masterEntry.close * currentPortfolio[key] * 100)/100
                    //             }
                    //             masterPortGraphArray.push(masterPortGraphData[masterEntry.time].data);
                    //           });
                    //         //  if(count >= flatArray.length)
                    //             that.chartData = masterPortGraphArray.sort();
                    //             that.externalMasterPortGraphArray = masterPortGraphArray.sort();
                    //         }
                    //       }
                    //   });
                    // }, 375 * index);
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
              // console.log("Get User Coin Data about to be called");
              setTimeout(function(){
                that.cardsContent = [];
                that.totalPortfolioValue = 0;
                that.getUserCoinData();
              }, 400)


            });
      //  })
      }

      public deleteCoin(form: any): void {
        this.cardsContent = [];
        this.totalPortfolioValue = 0;

        this.mongoDbService.deleteCoin(form).subscribe(result=>{
          //console.log("result of add coin from mongo db service");
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
