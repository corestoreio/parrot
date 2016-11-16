import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { API_BASE_URL } from './app.constants';

@Injectable()
export class AuthService {

  constructor(private http: Http) {
  }

  isLoggedIn() {
    return !!this.getToken();
  }

  getToken() {
    return localStorage.getItem('token');
  }

  login(email, password) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(
      `${API_BASE_URL}/authenticate`,
      JSON.stringify({ email, password }),
      { headers }
    )
      .map(res => res.json())
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
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(
      `${API_BASE_URL}/users`,
      JSON.stringify({ email, password }),
      { headers }
    )
      .map(res => res.json())
      .map(res => {
        return true;
      });
  }
}
