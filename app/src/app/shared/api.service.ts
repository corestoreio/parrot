import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { AppConfig } from './../app.config';

export interface RequestOptions {
    uri: string;
    method: string;
    body?: any;
    withAuthorization?: boolean;
}

@Injectable()
export class APIService {
    private apiEndpoint: string;

    constructor(private http: Http) {
        this.apiEndpoint = AppConfig.apiEndpoint;
    }

    getHeaders(withAuthorization: boolean) {
        if (withAuthorization === undefined) {
            withAuthorization = true;
        }

        let headers = new Headers();
        headers.append('Content-Type', 'application/json')
        headers.append('Accept', 'application/json');
        if (withAuthorization) {
            headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
        }
        return headers;
    }

    request(options: RequestOptions): Observable<any> {
        return this.http.request(
            `${this.apiEndpoint}${options.uri}`, {
                method: options.method || 'GET',
                headers: this.getHeaders(options.withAuthorization),
                body: options.body,
            })
            .map(res => res.json())
            .catch(err => Observable.throw(this.mapErrors(err.json().meta.error)));
    }

    mapErrors(error: any): string[] {
        switch (error.type) {
            case "ValidationFailure":
                return error.errors.map(err => err.message);
            case "AlreadyExists":
                return [error.message];
            default:
                return ['unkown error'];
        }
    }
}