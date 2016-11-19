import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { AuthService } from './../services/auth.service';

@Injectable()
export class UnauthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {
  }

  canActivate() {
    // If user is already logged in, redirect to projects
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['projects']);
      return false;
    }
    return true;
  }
}
