import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TierionService {

  result:any;

  constructor(private _http: Http) { }

  getUsers() {
    return this._http.get("/api/users")
    .map(result => this.result = result.json().data);
  }

  signUpUser(req) {
    console.log("tierionService called : " + req);
    return this._http.post("/api/sign-up", req)
    .map(result => this.result = result.json().data);
  }

}
