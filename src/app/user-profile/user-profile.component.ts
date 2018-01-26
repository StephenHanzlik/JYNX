import { Component, OnInit, ViewChild } from '@angular/core';
import {SuiModalService, TemplateModalConfig, ModalTemplate} from 'ng2-semantic-ui';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CryptoCompareService } from "../services/crypto-compare/crypto-compare.service";
import { MongoDbService } from "../services/mongo-db/mongo-db.service";
import { ALLCOINDATA } from "../static-data/all-coin-data";
import { COINOBJECTS } from "../static-data/coin-objects";


export interface IContext {
    data:string;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
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
      public totalPortfolioPercentageChange: any;
      public portfolioTotalArray: any = [];

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

        this.mongoDbService.getUserPortfolio().subscribe(result=>{
          result = JSON.parse((<any>result)._body);
          result = result[0];
          let aggregateTotalsObj: any = {};
          let coinAmts: Array<number> = result['coinAmts'];
          let coins: Array<string> = result['coins'];
          for (let l = 0; l < coins.length; l++) {
            if(aggregateTotalsObj[coins[l]])
              aggregateTotalsObj[coins[l]] = aggregateTotalsObj[coins[l]] + coinAmts[l];
            else
              aggregateTotalsObj[coins[l]] = coinAmts[l];
          }

          this.cryptoCompareService.getMultiFullPrice(Object.keys(aggregateTotalsObj).join()).subscribe(result=>{
              apiData = JSON.parse(result._body);
              apiData = apiData.RAW;
              let keys: Array<string> = [];
              let allCoinData: object = ALLCOINDATA[0];
              let iterable: number = 0;
              keys = Object.keys(apiData);
              keys.forEach(key=> {
                let coinToAdd = {
                   coinColor: colorsArray[iterable],
                   coinTicker: key,
                   coinName: allCoinData[key].CoinName,
                   coinPrice: this.addCommas(apiData[key]['USD']['PRICE'] * aggregateTotalsObj[key]),
                   coin24: Math.round(apiData[key]['USD']['CHANGEPCT24HOUR'] * 100)/100,
                  }
                  if(iterable < colorsArray.length)
                    iterable++;
                  else
                    iterable = 0;
                  console.log("coinToAdd");
                  console.log(coinToAdd);
                  console.log("this.totalPortfolioValue + apiData[key]['USD']['PRICE'] * aggregateTotalsObj[key]");
                  console.log(this.totalPortfolioValue + apiData[key]['USD']['PRICE'] * aggregateTotalsObj[key]);
                  this.cardsContent.push(coinToAdd);
                  this.totalPortfolioValue = this.totalPortfolioValue + apiData[key]['USD']['PRICE'] * aggregateTotalsObj[key];
                  // console.log(this.totalPortfolioValue);
              })
              this.totalPortfolioValue = this.addCommas(this.totalPortfolioValue);
          })


          // for(let i = 0; i < coins.length; i++){
          //   let coinToAdd = {
          //     coinName: coins[i],
          //     coinAmt: coinAmts[i],
          //   }
          //   this.cryptoCompareService.getMultiPrice(coinToAdd.coinName).subscribe(result=>{
          //       apiData = JSON.parse(result._body);
          //       usdAmt = apiData.USD;
          //       this.portfolioTotalArray.push(usdAmt);
          //       if( i === coins.length - 1){
          //             this.portfolioTotalArray.reduce( (prev, curr) => prev + curr );
          //       }
          //       this.updateCards(coinToAdd, usdAmt);
          //   })
          // }
        });
      }

      public chartCardData(cardTicker: string): void {

        this.cryptoCompareService.getHistoricalPrice(cardTicker).subscribe(result=>{
          console.log("result from history times");
          console.log(result._body);
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
        let apiData: any = {};
        let usdAmt: number = 0;

        this.cryptoCompareService.getSinglePrice(form.coinName).subscribe(result=>{
            apiData = JSON.parse(result._body);
            usdAmt = apiData.USD;

            //this.updatePieChart(form, usdAmt);
            this.updateCards(form, usdAmt);
            this.mongoDbService.addCoin(form).subscribe(result=>{
              console.log("result of add coin from mongo db service");
            });
        })
      }

      public deleteCoin(form: any): void {
        this.mongoDbService.deleteCoin(form).subscribe(result=>{
          console.log("result of add coin from mongo db service");
        });
      }

      private updateCards(newCoin: any, usdAmt: number): void {
          let allCoinData = ALLCOINDATA;
          let newCardData: any = {};
          newCardData.qty = Number.parseInt(newCoin.coinAmt);
          newCardData.asset = allCoinData[0][newCoin.coinName].FullName;
          newCardData.lastPrice = usdAmt;
          newCardData.usdValue = newCardData.lastPrice * newCardData.qty
          this.cardsContent.push(newCardData);
      }

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
