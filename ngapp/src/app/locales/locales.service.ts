import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { AuthService } from './../auth/auth.service';
import { API_BASE_URL } from './../app.constants';

@Injectable()
export class LocalesService {

    constructor(private http: Http, private auth: AuthService) { }

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

    private getApiHeaders() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.auth.getToken());
        return headers;
    }
}
