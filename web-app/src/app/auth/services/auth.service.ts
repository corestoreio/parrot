import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { tokenNotExpired } from 'angular2-jwt';
import 'rxjs/add/operator/map';

import { TokenService } from './token.service';
import { APIService } from './../../shared/api.service';
import { User } from './../../users/model/user';
import { UserService } from './../../users/services/user.service';

@Injectable()
export class AuthService {

    private tokenName: string = 'auth.token';

    constructor(
        private api: APIService,
        private token: TokenService,
        private userService: UserService,
    ) { }

    isLoggedIn(): boolean {
        let token = this.token.getToken();
        return tokenNotExpired(null, token);
    }

    login(user: User): Observable<boolean> {
        let headers: Headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this.api.request({
            uri: '/auth/token',
            method: 'POST',
            headers: headers,
            body: `grant_type=password&username=${user.email}&password=${user.password}`,
            withAuthorization: false,
        })
            .map(res => {
                let payload = res.payload;
                if (!payload) {
                    throw new Error("no payload in response");
                }
                let token = payload['access_token'];
                if (!token) {
                    throw new Error("no token in response");
                }
                this.token.storeToken(token);
                return true;
            });
    }

    register(user: User): Observable<boolean> {
        return this.api.request({
            uri: '/users/register',
            method: 'POST',
            body: JSON.stringify({ name: user.name, email: user.email, password: user.password }),
            withAuthorization: false,
        })
            .map(res => {
                let meta = res.meta;
                if (!meta) {
                    throw new Error("no meta in response");
                }
                if (meta.status < 200 || meta.status > 300) {
                    return false;
                }
                return true;
            });
    }
}
