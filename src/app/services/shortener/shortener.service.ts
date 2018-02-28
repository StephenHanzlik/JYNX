import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ShortenerService {

  constructor(private http: Http) { }

  public createShortLink(id: any): Observable<any>{
     return this.http.post(`http://localhost:3000/api/shortener`, id);
  }

}
