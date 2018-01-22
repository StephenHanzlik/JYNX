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
      @ViewChild('modalTemplate')
      public modalTemplate:ModalTemplate<IContext, string, string>

      newCoinForm: FormGroup;
      coinName: AbstractControl;
      coinAmt: AbstractControl;

      public cryptoDropDownList: any = [];
      public tableContent: any = [];
      public coinsToQuery: any = [];

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

      public openModal(dynamicContent:string = "Example") {
        const config = new TemplateModalConfig<IContext, string, string>(this.modalTemplate);

        config.closeResult = "closed!";
        config.context = { data: dynamicContent };

        this.modalService
            .open(config)
            .onApprove(result => {this.addCoin(result)})
            .onDeny(result => { /* deny callback */});
      }

      public addCoin(form: any): void {
        let apiData: any = {};
        let usdAmt = 0;

        this.cryptoCompareService.getPrice(form.coinName).subscribe(result=>{
            apiData = JSON.parse(result._body);
            usdAmt = apiData.USD;

            //this.updatePieChart(form, usdAmt);
            this.updateTableList(form, usdAmt);
            this.mongoDbService.addCoin(form).subscribe(result=>{
              console.log("result of add coin from mongo db service");
            });
        })
      }

      private getUserCoinData(): void {
        let apiData: any = {};
        let usdAmt: number = 0;

        this.mongoDbService.getUserPortfolio().subscribe(result=>{
          result = JSON.parse((<any>result)._body);
          result = result[0];
          let coins: Array<any> = result.coins;
          let coinAmts: Array<any> = result.coinAmts;

          for(let i = 0; i < coins.length; i++){
            let coinToAdd = {
              coinName: coins[i],
              coinAmt: coinAmts[i],
            }
            this.cryptoCompareService.getPrice(coinToAdd.coinName).subscribe(result=>{
                apiData = JSON.parse(result._body);
                usdAmt = apiData.USD;
                //this.updatePieChart(form, usdAmt);
                this.updateTableList(coinToAdd, usdAmt);
            })
          }
        });
      }

      private updateTableList(newCoin: any, usdAmt: number): void {
          let allCoinData = ALLCOINDATA;
          let newTableData: any = {};
          newTableData.qty = Number.parseInt(newCoin.coinAmt);
          newTableData.asset = allCoinData[0][newCoin.coinName].FullName;
          newTableData.lastPrice = usdAmt;
          newTableData.usdValue = newTableData.lastPrice * newTableData.qty
          this.tableContent.push(newTableData);
      }

      private getDropDownList(): void {
        this.cryptoDropDownList = COINOBJECTS;
      }

}
