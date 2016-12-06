import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { ProjectUsersService } from './../../users/services/project-users.service';
import { ProjectUser } from './../../users/model';

@Component({
    providers: [ProjectUsersService],
    selector: 'project-team-page',
    templateUrl: 'project-team-page.component.html',
    styleUrls: ['project-team-page.component.css']
})
export class ProjectTeamPage implements OnInit {
    private loading = false;
    private projectUsers: ProjectUser[];

    constructor(
        private route: ActivatedRoute,
        private projectUsersService: ProjectUsersService,
    ) { }

    ngOnInit() {
        this.route.parent.params
            .map(params => params['projectId'])
            .subscribe(projectId => {
                this.fetchUsers(projectId);
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