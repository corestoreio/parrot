import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class TokenService {

    private tokenName: string = 'auth.token';

    getToken(): string {
        return localStorage.getItem(this.tokenName);
    }

    removeToken(): void {
        localStorage.removeItem(this.tokenName);
    }

    storeToken(token: string): void {
        localStorage.setItem(this.tokenName, token);
    }
}
