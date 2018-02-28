import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ShortenerService {

  constructor(private http: Http) { }

  public createShortLink(id: any): Observable<any>{
      // alert("id: " + id);
      // let bodyObj: any = {
      //   id: id
      // };
      //bodyObj = JSON.stringify(bodyObj);
      let req = {
        id: id
      }
     return this.http.post(`http://localhost:3000/api/shortener`, req);
  }

}
