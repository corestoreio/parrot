import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { tokenNotExpired } from 'angular2-jwt';
import 'rxjs/add/operator/map';

import { APIService } from './../../shared/api.service';

@Injectable()
export class AuthService {

  constructor(private api: APIService) { }

  isLoggedIn(): boolean {
    let token = this.getToken();
    return tokenNotExpired(null, token);
  }

  getToken(): string {
    return localStorage.getItem('token');
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }

  login(email: string, password: string): Observable<boolean> {
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

  register(email: string, password: string): Observable<boolean> {
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
