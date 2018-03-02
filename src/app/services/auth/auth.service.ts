import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthService {

  constructor(private http: Http,
              public jwtHelper: JwtHelperService) { }

  public logIn(form: any){
    return this.http.post('/auth/log-in', form)
  }

  public signUp(form: any){
    return this.http.post('/auth/sign-up', form);
  }

  // ...
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    // Check whether the token is expired and return
    // true or false
    console.log("token");
    console.log(token);
    return !this.jwtHelper.isTokenExpired(token);
  }

}
