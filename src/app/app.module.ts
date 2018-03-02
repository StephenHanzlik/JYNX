import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing/app-routing.module';

import { AppComponent } from './app.component';
import { CryptoCompareService } from './services/crypto-compare/crypto-compare.service';
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
import { AdminComponent } from './admin/admin.component';
import { JynxPriceService } from './services/jynx-price/jynx-price.service';
import { ShortenerService } from './services/shortener/shortener.service';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';

export function highchartsFactory() {
  return highcharts;
}

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    SignUpComponent,
    HomeComponent,
    HighChartsComponent,
    SharablePortfolioComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SuiModule,
    HttpModule,
    AppRoutingModule,
    ChartModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('access_token');
        },
        whitelistedDomains: ['localhost:3001']
      }
    })
  ],
  providers: [CryptoCompareService, TierionService, AuthService, JynxPriceService, MongoDbService, ShortenerService, AuthGuardService, {provide: HighchartsStatic, useFactory: highchartsFactory}],
  bootstrap: [AppComponent, HighChartsComponent]
})

export class AppModule { }
