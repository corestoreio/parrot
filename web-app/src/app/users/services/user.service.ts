import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import { APIService } from './../../shared/api.service';
import { User, UpdateUserPasswordPayload, UpdateUserNamePayload, UpdateUserEmailPayload } from './../model';

@Injectable()
export class UserService {

    private _userSelf = new BehaviorSubject<User>(null);
    public userSelf = this._userSelf.asObservable();

    constructor(private api: APIService) {
        this.getUserSelf().subscribe();
    }

    isAuthorized(action: string): Observable<boolean> {
        let sub = new BehaviorSubject<boolean>(false);
        this.userSelf
            // TODO
            .subscribe(user => sub.next(false));
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

                this._userSelf.next(user);

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

                this._userSelf.next(user);

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

                this._userSelf.next(user);

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

                this._userSelf.next(user);

                return user;
            }).share();

        return request;
    }
}