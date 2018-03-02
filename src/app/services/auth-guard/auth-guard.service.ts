import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(public auth: AuthService, public router: Router) {}

  canActivate(): boolean {
    // if (!this.auth.isAuthenticated()) {
    //   this.router.navigate(['login-in']);
    //   return false;
    // }
    return true;
  }

}
