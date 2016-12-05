import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Project } from './../../projects/model/project';
import { ProjectsService } from './../../projects/services/projects.service';

@Component({
    selector: 'project-keys-page',
    templateUrl: 'project-keys-page.component.html'
})
export class ProjectKeysPage implements OnInit {
    private project: Project;
    private loading: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private projectsService: ProjectsService,
    ) {
    }

    ngOnInit() {
        this.route.parent.params
            .map(params => params['projectId'])
            .subscribe(projectId => {
                this.fetchProject(projectId);
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