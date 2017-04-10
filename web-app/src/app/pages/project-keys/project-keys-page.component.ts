import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Project } from './../../projects/model/project';
import { UserService } from './../../users/services/user.service';
import { ProjectsService } from './../../projects/services/projects.service';

@Component({
    selector: 'project-keys-page',
    templateUrl: 'project-keys-page.component.html'
})
export class ProjectKeysPage implements OnInit {
    private project: Project;
    public loading: boolean = false;
    private canEdit: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private projectsService: ProjectsService,
        private userService: UserService,
    ) {
    }

    ngOnInit() {
        this.route.parent.params
            .map(params => params['projectId'])
            .subscribe(projectId => {
                this.fetchProject(projectId);
                this.userService.isAuthorized(projectId, 'CanUpdateProject')
                    .subscribe(ok => this.canEdit = ok);
            });
    }

    fetchProject(projectId) {
        this.loading = true;
        this.projectsService.fetchProject(projectId)
            .subscribe(
            project => this.project = project,
            err => console.log(err),
            () => this.loading = false,
        );
    }
}
