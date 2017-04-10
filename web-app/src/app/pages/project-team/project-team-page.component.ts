import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { ProjectUsersService } from './../../users/services/project-users.service';
import { ProjectUser } from './../../users/model';
import { UserService } from './../../users/services/user.service';

@Component({
    providers: [ProjectUsersService],
    selector: 'project-team-page',
    templateUrl: 'project-team-page.component.html',
    styleUrls: ['project-team-page.component.css']
})
export class ProjectTeamPage implements OnInit {
    public loading: boolean = false;
    private projectUsers: ProjectUser[];
    private projectId: string;
    private canUpdateRoles: boolean = false;
    private canAssignRoles: boolean = false;
    private canRevokeRoles: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private projectUsersService: ProjectUsersService,
        private userService: UserService,
    ) { }

    ngOnInit() {
        this.route.parent.params
            .map(params => params['projectId'])
            .subscribe(projectId => {
                this.projectId = projectId;
                this.fetchUsers(projectId);
                this.userService.isAuthorized(this.projectId, 'CanUpdateProjectRoles')
                    .subscribe(ok => { this.canUpdateRoles = ok });
                this.userService.isAuthorized(this.projectId, 'CanAssignProjectRoles')
                    .subscribe(ok => { this.canAssignRoles = ok });
            });

        this.projectUsersService.projectUsers
            .subscribe(users => this.projectUsers = users);
    }

    fetchUsers(projectId: string) {
        this.loading = true;
        this.projectUsersService.fetchProjectUsers(projectId)
            .subscribe(
            () => { },
            err => console.log(err),
            () => this.loading = false,
        );
    }
}
