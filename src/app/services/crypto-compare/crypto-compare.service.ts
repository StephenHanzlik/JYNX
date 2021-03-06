import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CryptoCompareService {

  constructor(private http: Http) { }

  public getCryptoList(): Observable<any>{
     return this.http.get(`https://min-api.cryptocompare.com/data/all/coinlist`);
  }

  public getSinglePrice(coinQueryString: string): Observable<any>{
    return this.http.get(`https://min-api.cryptocompare.com/data/price?fsym=${coinQueryString}&tsyms=USD`);
  }

  public getMultiFullPrice(coinQueryString: string): Observable<any>{
    return this.http.get(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${coinQueryString}&tsyms=USD`);
  }

  public getHistoricalPrice(coinQueryString: string): Observable<any>{
    return this.http.get(`https://min-api.cryptocompare.com/data/histohour?fsym=${coinQueryString}&tsym=USD&limit=500`);
    // return this.http.get(`https://min-api.cryptocompare.com/data/histoday?fsym=${coinQueryString}&tsym=USD&limit=2000&allData=true`);
  }

}
