import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class JynxPriceService {

  constructor(private http: Http) { }

  public getPrices(): Observable<any>{
     return this.http.get(`https://stark-anchorage-98466.herokuapp.com/api/price`);
  }

}
