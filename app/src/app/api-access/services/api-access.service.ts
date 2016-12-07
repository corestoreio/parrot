import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import { APIService } from './../../shared/api.service';
import { Application } from './../model/app';

let mockApps = [
    { clientId: '123123123123', name: 'My application', secret: 'MY_SUPER_SECRET' },
    { clientId: '456456456465', name: 'My other application', secret: 'MY_OTHER_SUPER_SECRET' },
];

@Injectable()
export class APIAccessService {

    private _apps = new BehaviorSubject<Application[]>(mockApps);
    public apps: Observable<Application[]> = this._apps.asObservable();

    constructor(private api: APIService) { }

    registerApp(projectId: string, appName: string): Observable<Application> {
        let mockApp: Application = { clientId: Math.random().toString(36).substring(7), name: appName, secret: Math.random().toString(36).substring(7) };
        this._apps.next(this._apps.getValue().concat(mockApp));
        return new BehaviorSubject<Application>(mockApp).asObservable();

        let request = this.api.request({
            uri: `/projects/${projectId}/apps`,
            method: 'POST',
            body: JSON.stringify({ name: appName })
        })
            .map(res => {
                let app = res.payload;
                if (!app) {
                    throw new Error("no app in response");
                }
                return app;
            }).share();

        request.subscribe(app => {
            let newApps = this._apps.getValue().concat(app);
            this._apps.next(newApps);
        }, () => { });

        return request;
    }

    fetchApps(projectId: string): Observable<Application[]> {
        this._apps.next(mockApps);
        return new BehaviorSubject<Application[]>(mockApps).asObservable();

        let request = this.api.request({
            uri: `/projects/${projectId}/apps`,
            method: 'GET',
        })
            .map(res => {
                let apps = res.payload;
                if (!apps) {
                    throw new Error("no apps in response");
                }
                return apps;
            }).share();

        request.subscribe(apps => {
            this._apps.next(apps);
        }, () => { });

        return request;
    }

    fetchApp(projectId: string, clientId: string): Observable<Application> {
        return new BehaviorSubject<Application>(mockApps.find(app => app.clientId === clientId)).asObservable();

        let request = this.api.request({
            uri: `/projects/${projectId}/apps/${clientId}`,
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

}