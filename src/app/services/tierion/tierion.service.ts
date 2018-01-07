import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class TierionService {

  result:any;

  constructor(private _http: Http) { }

  getUsers() {
    return this._http.get("/api/users")
    .map(result => this.result = result.json().data);
  }
  //unused node function
  // signUpUser(req) {
  //   console.log("tierionService called : " + req);
  //   return this._http.post("/api/sign-up", req)
  //   .map(result => this.result = result.json().data);
  // }
  public signUpUser(form: any): Observable <any>{

  form.datastoreId = 5526;

  let headers = new Headers();
  headers.append("X-Username", "stephenhanzlik@gmail.com");
  headers.append("X-Api-Key", "/dGns7iU5t6j9/78Ld/6miNNMYJn0AlOcLTOK3Mu+5A=");
  headers.append("Content-Type", "application/json");

  let options = new RequestOptions({ headers: headers });

  return this._http.post("https://api.tierion.com/v1/records", form, options);

  }
}
