import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpModule } from '@angular/http';


import { AppComponent } from './app.component';
import { ChartsComponent } from './charts/charts.component';
import { CryptoCompareService } from './crypto-compare.service';

@NgModule({
  declarations: [
    AppComponent,
    ChartsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SuiModule,
    HttpModule
  ],
  providers: [CryptoCompareService],
  bootstrap: [AppComponent]
})
export class AppModule { }
