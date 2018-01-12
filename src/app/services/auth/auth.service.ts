import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';

@Injectable()
export class AuthService {

  constructor(private http: Http) { }

  public logIn(form: any){
    return this.http.post('/api/log-in', form)
  }

  public signUp(form: any){
    return this.http.post('/api/sign-up', form);
  }

}
