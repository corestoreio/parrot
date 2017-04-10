import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import { APIService } from './../../shared/api.service';
import { ProjectClient } from './../model/app';

@Injectable()
export class APIAccessService {

    private _clients = new BehaviorSubject<ProjectClient[]>([]);
    public projectClients: Observable<ProjectClient[]> = this._clients.asObservable();

    constructor(private api: APIService) { }

    registerProjectClient(projectId: string, clientName: string): Observable<ProjectClient> {
        let request = this.api.request({
            uri: `/projects/${projectId}/clients`,
            method: 'POST',
            body: JSON.stringify({ name: clientName })
        })
            .map(res => {
                let app = res.payload;
                if (!app) {
                    throw new Error("no app in response");
                }
                return app;
            }).share();

        request.subscribe(
            client => {
                let result = this._clients.getValue().concat(client);
                this._clients.next(result);
            },
            err => console.log(err),
        );

        return request;
    }

    updateProjectClientName(projectId: string, client: ProjectClient): Observable<ProjectClient> {
        let request = this.api.request({
            uri: `/projects/${projectId}/clients/${client.client_id}/name`,
            method: 'PATCH',
            body: JSON.stringify({ name: client.name })
        })
            .map(res => {
                let app = res.payload;
                if (!app) {
                    throw new Error("no app in response");
                }
                return app;
            }).share();

        request.subscribe(
            result => {
                let newApps = this._clients.getValue().map(current => current.client_id === result.clientId ? result : current);
                this._clients.next(newApps);
            },
            err => console.log(err),
        );

        return request;
    }

    resetProjectClientSecret(projectId: string, clientId: string): Observable<ProjectClient> {
        let request = this.api.request({
            uri: `/projects/${projectId}/clients/${clientId}/resetSecret`,
            method: 'PATCH'
        })
            .map(res => {
                let client = res.payload;
                if (!client) {
                    throw new Error("no app in response");
                }
                return client;
            }).share();

        request.subscribe(
            result => {
                let newApps = this._clients.getValue().map(current => current.client_id === result.clientId ? result : current);
                this._clients.next(newApps);
            },
            err => console.log(err),
        );

        return request;
    }

    fetchProjectClients(projectId: string): Observable<ProjectClient[]> {
        let request = this.api.request({
            uri: `/projects/${projectId}/clients`,
            method: 'GET',
        })
            .map(res => {
                let clients = res.payload;
                if (!clients) {
                    throw new Error("no clients in response");
                }
                return clients;
            }).share();

        request.subscribe(
            clients => {
                this._clients.next(clients);
            },
            err => console.log(err),
        );

        return request;
    }

    fetchProjectClient(projectId: string, clientId: string): Observable<ProjectClient> {
        let request = this.api.request({
            uri: `/projects/${projectId}/clients/${clientId}`,
            method: 'GET',
        })
            .map(res => {
                let app = res.payload;
                if (!app) {
                    throw new Error("no app in response");
                }
                return app;
            }).share();

        return request;
    }

    deleteProjectClient(projectId: string, clientId: string): Observable<any> {
        let request = this.api.request({
            uri: `/projects/${projectId}/clients/${clientId}`,
            method: 'DELETE',
        }).share();

        return request;
    }

}
