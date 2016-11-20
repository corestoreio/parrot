import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth';

@Component({
  selector: 'root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'Parrot';

  constructor(private router: Router, private auth: AuthService) { }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
