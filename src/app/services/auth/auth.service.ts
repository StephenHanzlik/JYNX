import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';

@Injectable()
export class AuthService {

  constructor(private http: Http) { }

  public logIn(form: any){
    return this.http.post('/auth/log-in', form)
  }

  public signUp(form: any){
    return this.http.post('/auth/sign-up', form);
  }

  // ...
  // public isAuthenticated(): boolean {
  //   let token = localStorage.getItem('token');
  //
  //   // Check whether the token is expired and return
  //   // true or false
  //   return !this.jwtHelper.isTokenExpired(token);
  // }


}
