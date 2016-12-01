import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './../services/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {
  private errors: string[];

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() { }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  onSubmit(email: string, password: string) {
    this.auth.login(email, password).subscribe(
      result => {
        this.router.navigate(['/projects']);
      },
      err => {
        this.errors = err;
      });
  }
}
