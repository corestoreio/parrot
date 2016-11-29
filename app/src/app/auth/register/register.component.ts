import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './../services/auth.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  private errors = [];

  constructor(private auth: AuthService, private router: Router) {
    this.onSubmit = this.onSubmit.bind(this);
  }

  ngOnInit() { }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  handleError(err) {
    if (!err || !(err instanceof Object)) {
      console.error(err);
      return;
    }

    switch (err.type) {
      case "ValidationFailure":
        this.errors = err.errors;
        break;
      case "AlreadyExists":
        this.errors = [err];
        break;
      default:
        console.error(err);
        break;
    }
  }

  onSubmit(email, password) {
    this.auth.register(email, password).subscribe(
      result => {
        this.auth.login(email, password).subscribe(
          result => {
            this.router.navigate(['/projects']);
          },
          err => {

          });
      },
      err => this.handleError(err)
    );
  }
}
