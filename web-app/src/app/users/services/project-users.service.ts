import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import { APIService } from './../../shared/api.service';
import { ProjectUser } from './../model';
import { UserRoles } from './../../app.constants';

@Injectable()
export class ProjectUsersService {

    private _projectUsers = new BehaviorSubject<ProjectUser[]>([]);
    public projectUsers = this._projectUsers.asObservable();

    constructor(private api: APIService) { }

    get availableRoles(): string[] {
        return UserRoles;
    }

    fetchProjectUsers(projectId: string): Observable<ProjectUser[]> {
        let request = this.api.request({
            uri: `/projects/${projectId}/users`,
            method: 'GET',
        })
            .map(res => {
                let users = res.payload;
                if (!users) {
                    throw new Error("no users in response");
                }
                return users;
            }).share();

        request.subscribe(
            users => { this._projectUsers.next(users); }
        );

        return request;
    }

    createProjectUser(projectUser: ProjectUser): Observable<ProjectUser> {
        let request = this.api.request({
            uri: `/projects/${projectUser.project_id}/users`,
            method: 'POST',
            body: JSON.stringify(projectUser)
        })
            .map(res => {
                let result = res.payload;
                if (!result) {
                    throw new Error("no result in response");
                }
                return result;
            }).share();

        request.subscribe(
            user => {
                let users = this._projectUsers.getValue().concat(user);
                this._projectUsers.next(users);
            },
            err => console.log(err)
        );

        return request;
    }

    updateProjectUser(projectUser: ProjectUser): Observable<ProjectUser> {
        let request = this.api.request({
            uri: `/projects/${projectUser.project_id}/users/${projectUser.user_id}/role`,
            method: 'PATCH',
            body: JSON.stringify(projectUser)
        })
            .map(res => {
                let result = res.payload;
                if (!result) {
                    throw new Error("no result in response");
                }
                return result;
            }).share();

        request.subscribe(
            updatedUser => {
                let users = this._projectUsers.getValue().map(user => user.user_id === updatedUser.user_id ? updatedUser : user);
                this._projectUsers.next(users);
            },
            err => console.log(err)
        );

        return request;
    }

    revokeProjectUser(projectUser: ProjectUser): Observable<ProjectUser> {
        let request = this.api.request({
            uri: `/projects/${projectUser.project_id}/users/${projectUser.user_id}`,
            method: 'DELETE'
        }).share();

        request.subscribe(
            () => {
                let users = this._projectUsers.getValue().filter(user => user.user_id !== projectUser.user_id);
                this._projectUsers.next(users);
            },
            err => console.log(err)
        );

        return request;
    }
}
