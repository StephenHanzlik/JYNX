import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';

@Injectable()
export class MongoDbService {

  constructor(private http: Http) { }


  public addCoin(form: any){
    return this.http.post('/api/sign-up', form);
  }

}
