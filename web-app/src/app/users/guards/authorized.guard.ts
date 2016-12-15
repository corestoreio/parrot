import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { UserService } from './../services/user.service';

@Injectable()
export class AuthorizedGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) { }

  canActivate(): Observable<boolean> {
    return this.userService.isAuthorized('')
      .map(ok => {
        if (ok) {
          return true;
        }
        this.router.navigate(['/error'], { queryParams: { error: 'Unauthorized', message: 'You are not authorized to access this resource.' } });
        return false;
      })
  }
}
