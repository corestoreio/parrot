import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './../services/auth.service';
import { User } from './../model/user';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['register.component.css']
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

  onSubmit(name: string, email: string, password: string) {
    let user = new User(name, email, password);
    this.auth.register(user).subscribe(
      () => {
        this.auth.login(user).subscribe(
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
