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
<<<<<<< HEAD
  // public isAuthenticated(): boolean {
  //   let token = localStorage.getItem('token');
  //
  //   // Check whether the token is expired and return
  //   // true or false
  //   return !this.jwtHelper.isTokenExpired(token);
  // }
=======
  public isAuthenticated(): boolean {
    let token = localStorage.getItem('token');

    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }
>>>>>>> auth-guard

}
