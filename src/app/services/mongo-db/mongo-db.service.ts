import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';

@Injectable()
export class MongoDbService {

  constructor(private http: Http) { }


  public addCoin(form: any){
    console.log("service triggered");
    return this.http.post('/api/add-coin', form);
  }

}
