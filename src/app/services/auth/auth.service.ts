import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';

@Injectable()
export class AuthService {

  constructor(private http: Http) { }

  private logIn(form: any) {
    return this.http.post('/api/log-in', form)


  }

}
