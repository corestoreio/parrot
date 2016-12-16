import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import { APIService } from './../../shared/api.service';
import { ProjectsService } from './../../projects/services/projects.service';
import { User, UpdateUserPasswordPayload, UpdateUserNamePayload, UpdateUserEmailPayload } from './../model';

@Injectable()
export class UserService {

    private _userSelf = new BehaviorSubject<User>(null);
    public userSelf = this._userSelf.asObservable();

    constructor(
        private api: APIService,
        private route: ActivatedRoute,
    ) {
        this.getUserSelf().subscribe();
    }

    isAuthorized(grant: string): Observable<boolean> {
        let sub = new BehaviorSubject<boolean>(false);
        this.userSelf
            .withLatestFrom(
            this.route.params.map(params => params['projectId']),
            (x, y) => { return { user: x, projectId: y } }
            )
            .subscribe(result => {
                let user = result.user;
                let projectId = result.projectId;
                if (!user || !projectId) {
                    return;
                }
                let projectGrants: string[] = user.projectGrants[projectId];
                if (!projectGrants) {
                    sub.next(false);
                    return;
                }
                console.log(grant);
                console.log(projectGrants);
                let allowed: boolean = !!projectGrants.find(current => current === grant);
                console.log(allowed);
                sub.next(allowed);
            });
        return sub.asObservable();
    }

    getUserSelf(): Observable<User> {
        let request = this.api.request({
            uri: `/users/self?include=projectGrants`,
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