import { Injectable } from '@angular/core';
import { Router, CanActivate, CanLoad } from '@angular/router';

import { AuthService } from './../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private auth: AuthService, private router: Router) { }

  canLoad(): boolean {
    return this.loggedInOrRedirect();
  }

  canActivate(): boolean {
    return this.loggedInOrRedirect();
  }

  loggedInOrRedirect(): boolean {
    if (this.auth.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['login']);
    return false;
  }
}
