import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import { APIService } from './../../shared/api.service';
import { User, UpdateUserPasswordPayload, UpdateUserNamePayload, UpdateUserEmailPayload } from './../model';

@Injectable()
export class UserService {

    constructor(private api: APIService) { }

    isAuthorized(action: string): Observable<boolean> {
        let sub = new BehaviorSubject<boolean>(false);
        this.getUserSelf()
            .subscribe(user => {
                // TODO
                sub.next(false);
            });
        return sub.asObservable();
    }

    getUserSelf(): Observable<User> {
        let request = this.api.request({
            uri: `/users/self`,
            method: 'GET',
        })
            .map(res => {
                let user = res.payload;
                if (!user) {
                    throw new Error("no user in response");
                }
                return user;
            }).share();

        return request;
    }

    updatePassword(payload: UpdateUserPasswordPayload): Observable<User> {
        let request = this.api.request({
            uri: `/users/self/password`,
            method: 'PATCH',
            body: JSON.stringify(payload),
        })
            .map(res => {
                let user = res.payload;
                if (!user) {
                    throw new Error("no user in response");
                }
                return user;
            }).share();

        return request;
    }

    updateName(payload: UpdateUserNamePayload): Observable<User> {
        let request = this.api.request({
            uri: `/users/self/name`,
            method: 'PATCH',
            body: JSON.stringify(payload),
        })
            .map(res => {
                let user = res.payload;
                if (!user) {
                    throw new Error("no user in response");
                }
                return user;
            }).share();

        return request;
    }

    updateEmail(payload: UpdateUserEmailPayload): Observable<User> {
        let request = this.api.request({
            uri: `/users/self/email`,
            method: 'PATCH',
            body: JSON.stringify(payload),
        })
            .map(res => {
                let user = res.payload;
                if (!user) {
                    throw new Error("no user in response");
                }
                return user;
            }).share();

        return request;
    }
}