import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProjectsService } from './../../projects/services/projects.service';
import { Project } from './../../projects/model/project';

@Component({
    selector: 'project-keys-page',
    templateUrl: 'project-keys-page.component.html'
})
export class ProjectKeysPage implements OnInit {
    private project: Project;
    private loading: boolean = false;
    private createKeyPending: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private projectsService: ProjectsService,
    ) {
        this.updateProjectKeys = this.updateProjectKeys.bind(this);
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

    updateProjectKeys(projectId, keys) {
        this.createKeyPending = true;
        this.projectsService.updateProjectKeys(projectId, keys)
            .subscribe(
            project => this.project = project,
            err => console.log(err),
            () => this.createKeyPending = false
            );
    }
}