import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing/app-routing.module';

import { AppComponent } from './app.component';
import { ChartsComponent } from './charts/charts.component';
import { CryptoCompareService } from './services/crypto-compare/crypto-compare.service';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { LogInComponent } from './log-in/log-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { TierionService } from './services/tierion/tierion.service';
import { HomeComponent } from './home/home.component';
import { HighChartsComponent } from './high-charts/high-charts.component';
import { AuthService } from './services/auth/auth.service';
import { MongoDbService } from './services/mongo-db/mongo-db.service';
import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import * as highcharts from 'highcharts/highstock';
import { SharablePortfolioComponent } from './sharable-portfolio/sharable-portfolio.component';

export function highchartsFactory() {
  return highcharts;
}

@NgModule({
  declarations: [
    AppComponent,
    ChartsComponent,
    UserProfileComponent,
    LogInComponent,
    SignUpComponent,
    HomeComponent,
    HighChartsComponent,
    SharablePortfolioComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SuiModule,
    HttpModule,
    AppRoutingModule,
    ChartModule
  ],
  providers: [CryptoCompareService, TierionService, AuthService, MongoDbService, {provide: HighchartsStatic, useFactory: highchartsFactory}],
  bootstrap: [AppComponent, HighChartsComponent]
})

export class AppModule { }
