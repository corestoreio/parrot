import { Injectable } from '@angular/core';
import { Http, Headers, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { environment } from './../../environments/environment';
import { TokenService } from './../auth/services/token.service';

export interface RequestOptions {
    uri: string;
    method: string;
    body?: any;
    headers?: Headers;
    withAuthorization?: boolean;
}

@Injectable()
export class APIService {
    private apiUrl: string;

    constructor(
        private http: Http,
        private token: TokenService
    ) {
        this.apiUrl = environment.apiEndpoint;
    }

    getHeaders(withAuthorization: boolean) {
        if (withAuthorization === undefined) {
            withAuthorization = true;
        }

        let headers = new Headers();
        headers.append('Content-Type', 'application/json')
        headers.append('Accept', 'application/json');
        if (withAuthorization) {
            headers.append('Authorization', `Bearer ${this.token.getToken()}`);
        }
        return headers;
    }

    request(options: RequestOptions): Observable<any> {
        return this.http.request(
            `${this.apiUrl}${options.uri}`, {
                method: options.method || 'GET',
                headers: options.headers || this.getHeaders(options.withAuthorization),
                body: options.body,
            })
            .map(res => res.json())
            .catch(err => {
                if (err.status <= 0) {
                    console.error(err);
                    return Observable.throw('internal error');
                }
                return Observable.throw(err.json().meta.error);
            });
    }

    requestDownload(options: RequestOptions): Observable<any> {
        return this.http.request(
            `${this.apiUrl}${options.uri}`, {
                method: options.method || 'GET',
                headers: options.headers || this.getHeaders(options.withAuthorization),
                body: options.body,
                responseType: ResponseContentType.Blob,
            })
            .map(res => res.blob())
            .catch(err => { console.error(err); return Observable.throw(err); });
    }

    mapErrors(error: any): string[] {
        switch (error.type) {
            case "ValidationFailure":
                return error.errors.map(err => err.message);
            case "AlreadyExists":
                return [error.message];
            case "Unauthorized":
                return [error.message];
            default:
                return ['Something went wrong. That\'s all we know\'.'];
        }
    }
}
