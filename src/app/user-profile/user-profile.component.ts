newCardDataimport { Component, OnInit, ViewChild } from '@angular/core';
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

        this.mongoDbService.getUserPortfolio().subscribe(result=>{
          result = JSON.parse((<any>result)._body);
          result = result[0];
          console.log("portfolio result: ");
          console.log(result);
          let coins: Array<string> = result['coins'];
          let coinAmts: Array<number> = result['coinAmts'];

          this.cryptoCompareService.getMultiFullPrice(coins.join()).subscribe(result=>{
              apiData = JSON.parse(result._body);
              apiData = apiData.RAW;
              console.log("apiData");
              console.log(apiData);
              let keys: Array<string> = [];
              keys = Object.keys(apiData);
              //console.log("keys: " + keys);
              keys.forEach(key=> {
              //  console.log(apiData[key]);
                let coinToAdd = {
                   coinName: key,
                   coinPrice: apiData[key]['USD']['PRICE'],
                   coin24: apiData[key]['USD']['CHANGE24HOUR'],
                  }
                  console.log("coinToAdd");
                  console.log(coinToAdd);
              })
              //usdAmt = apiData.USD;
            //  this.portfolioTotalArray.push(usdAmt);
              //console.log("apiData: " + JSON.stringify(apiData));
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
