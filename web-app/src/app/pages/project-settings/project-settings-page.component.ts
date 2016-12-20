import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Project } from './../../projects/model/project';
import { UserService } from './../../users/services/user.service';
import { ProjectsService } from './../../projects/services/projects.service';

@Component({
    selector: 'project-settings-page',
    templateUrl: 'project-settings-page.component.html'
})
export class ProjectSettingsPage implements OnInit {
    private project: Project;
    private loading: boolean = false;
    private canDeleteProject: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private projectsService: ProjectsService,
        private userService: UserService,
    ) {
    }

    ngOnInit() {
        this.projectsService.activeProject
            .subscribe(project => this.project = project);

        this.route.parent.params
            .map(params => params['projectId'])
            .subscribe(projectId => {
                this.fetchProject(projectId);
                this.userService.isAuthorized(projectId, 'CanDeleteProject')
                    .subscribe(ok => this.canDeleteProject = ok);
            });
    }

    fetchProject(projectId) {
        this.loading = true;
        this.projectsService.fetchProject(projectId)
            .subscribe(
            project => { },
            err => console.log(err),
            () => this.loading = false,
        );
    }
}