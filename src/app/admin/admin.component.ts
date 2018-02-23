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
          let ourApiResult = result;

          this.portfolioName = result[0]['portfolioName'];

          this.chartData = result[0].masterPortfolioList

          let currentPortfolio: any = {};
          currentPortfolio = result[0].coins;

          console.log("ourApiResult");
          console.log(ourApiResult);

          //old method below

         this.historicPortfolio = result;
        //  let currentPortfolio: any = {};

        //  currentPortfolio = result[0].coins;
          let currentPortfolioKeys: Array<string> = Object.keys(currentPortfolio);

          if(currentPortfolioKeys.length > 0 && currentPortfolioKeys[0] !== "no ticker"){
            this.cryptoCompareService.getMultiFullPrice(currentPortfolioKeys.join()).subscribe(result=>{
                apiData = JSON.parse(result._body);
                apiData = apiData.RAW;
                console.log("apiData")
                console.log(apiData);

                let keys: Array<string> = [];
                let allCoinData: object = ALLCOINDATA[0];
                let iterable: number = 0;
                if(ourApiResult[0].masterCoinList)
                  keys = Object.keys(ourApiResult[0].masterCoinList);
                else
                  return;
                let index = 0;
                let keysCounter = 0;

                let mostRecentTotal = ourApiResult[0].masterPortfolioList.pop();
                mostRecentTotal = mostRecentTotal[1]

                console.log("mostRecentTotal");
                console.log(mostRecentTotal);

                this.totalPortfolioValue = mostRecentTotal;
                if(ourApiResult[0].masterPortfolioList.length > 0){

                  let secondMostRecentTotal = ourApiResult[0].masterPortfolioList.pop();
                  mostRecentTotal = mostRecentTotal[1];

                  this.totalPortfolioValue = mostRecentTotal[1];
                  this.totalPortfolioValue24hr = secondMostRecentTotal[1];

                  ourApiResult[0].masterPortfolioList.push(secondMostRecentTotal);
                }
                else{
                  this.totalPortfolioValue = mostRecentTotal;
                  this.totalPortfolioValue24hr = 0;
                }

                ourApiResult[0].masterPortfolioList.push(mostRecentTotal);

                keys.forEach(key=> {

                  let mostRecent = ourApiResult[0].masterCoinList[key].pop();
                  ourApiResult[0].masterCoinList[key].push(mostRecent);

                  keysCounter++;
                  let coinToAdd = {
                     coinColor: colorsArray[iterable],
                     coinColorName: colorNamesArray[iterable],
                     coinTicker: key,
                     coinAmt: currentPortfolio[key],
                     coinName: allCoinData[key].CoinName,
                     coinPrice: this.addCommas(mostRecent[1]),
                     coin24Percent: Math.round(apiData[key]['USD']['CHANGEPCT24HOUR'] * 100)/100,
                     coin24Open: parseInt(apiData[key]['USD']['OPEN24HOUR'], 10),
                     notSelected: true,
                    }

                    if(iterable < colorsArray.length)
                      iterable++;
                    else
                      iterable = 0;

                      console.log

                    this.cardsContent.push(coinToAdd);

                })

                let change: number = this.totalPortfolioValue - this.totalPortfolioValue24hr;

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
              }, 800)
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
