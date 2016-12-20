import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './../services/auth.service';
import { User } from './../../users/model/user';
import { ErrorsService } from './../../shared/errors.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {
  private errors: string[];

  constructor(private auth: AuthService, private router: Router, private errorsService: ErrorsService) { }

  ngOnInit() { }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  onSubmit(email: string, password: string) {
    let user = { email: email, password: password };
    this.auth.login(user).subscribe(
      result => {
        this.router.navigate(['/projects']);
      },
      err => this.errors = this.errorsService.mapErrors(err, 'Login'));
  }
}
