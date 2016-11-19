import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { AuthService } from './../../auth';
import { API_BASE_URL } from './../../app.constants';

@Injectable()
export class LocalesService {

    constructor(private http: Http, private auth: AuthService) { }

    createLocale(projectId: number, locale) {
        return this.http.post(
            `${API_BASE_URL}/projects/${projectId}/locales`,
            JSON.stringify(locale),
            { headers: this.getApiHeaders() }
        )
            .map(res => res.json())
            .map(res => {
                let locale = res.payload;
                if (!locale) {
                    throw new Error("no locale in response");
                }
                return locale;
            })
    }

    updateLocalePairs(projectId: number, localeIdent: string, pairs) {
        return this.http.patch(
            `${API_BASE_URL}/projects/${projectId}/locales/${localeIdent}/pairs`,
            JSON.stringify(pairs),
            { headers: this.getApiHeaders() }
        )
            .map(res => res.json())
            .map(res => {
                let payload = res.payload;
                if (!payload) {
                    throw new Error("no payload in response");
                }
                return payload;
            })
    }

    getLocales(projectId: number) {
        return this.http.get(
            `${API_BASE_URL}/projects/${projectId}/locales`,
            { headers: this.getApiHeaders() }
        )
            .map(res => res.json())
            .map(res => {
                let projects = res.payload;
                if (!projects) {
                    throw new Error("no projects in response");
                }
                return projects;
            })
    }

    getLocale(projectId: number, localeIdent: string) {
        return this.http.get(
            `${API_BASE_URL}/projects/${projectId}/locales/${localeIdent}`,
            { headers: this.getApiHeaders() }
        )
            .map(res => res.json())
            .map(res => {
                let locale = res.payload;
                if (!locale) {
                    throw new Error("no locale in response");
                }
                return locale;
            })
    }

    private getApiHeaders() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.auth.getToken());
        return headers;
    }
}
