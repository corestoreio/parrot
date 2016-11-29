import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './../services/auth.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  private errors: string[];

  constructor(private auth: AuthService, private router: Router) {
    this.onSubmit = this.onSubmit.bind(this);
  }

  ngOnInit() { }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  onSubmit(email: string, password: string) {
    this.auth.register(email, password).subscribe(
      () => {
        this.auth.login(email, password).subscribe(
          () => {
            this.router.navigate(['/projects']);
          },
          err => {
            err => this.errors = err
          });
      },
      err => this.errors = err
    );
  }
}
