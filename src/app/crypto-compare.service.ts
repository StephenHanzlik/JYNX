import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CryptoCompareService {

  constructor(private http: Http) { }

  public getCryptoList(): Observable<any>{
     return this.http.get(`https://min-api.cryptocompare.com/data/all/coinlist`);
  }

}
