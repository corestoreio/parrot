import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { tokenNotExpired } from 'angular2-jwt';
import 'rxjs/add/operator/map';

import { APIService } from './../../shared/api.service';

@Injectable()
export class AuthService {

  constructor(private api: APIService) { }

  isLoggedIn() {
    let token = this.getToken();
    return tokenNotExpired(null, token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }

  login(email, password) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.api.request({
      uri: '/authenticate',
      method: 'POST',
      body: JSON.stringify({ email, password }),
      withAuthorization: false,
    })
      .map(res => {
        let token = res.payload.token;
        if (!token) {
          throw new Error("no token in response");
        }
        localStorage.setItem('token', token);
        return true;
      });
  }

  register(email, password) {
    return this.api.request({
      uri: '/users',
      method: 'POST',
      body: JSON.stringify({ email, password }),
      withAuthorization: false,
    })
      .map(res => {
        return true;
      });
  }
}
