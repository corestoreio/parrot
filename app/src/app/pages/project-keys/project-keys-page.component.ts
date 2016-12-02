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
    private addKeyPending: boolean = false;
    private deleteKeyPending: boolean = false;
    private updateKeyPending: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private projectsService: ProjectsService,
    ) {
        this.addProjectKey = this.addProjectKey.bind(this);
        this.deleteProjectKey = this.deleteProjectKey.bind(this);
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

    addProjectKey(projectId: string, key: string) {
        this.addKeyPending = true;
        this.projectsService.addProjectKey(projectId, key)
            .subscribe(
            project => this.project = project,
            err => console.log(err),
            () => this.addKeyPending = false
            );
    }

    deleteProjectKey(projectId: string, key: string) {
        this.deleteKeyPending = true;
        this.projectsService.deleteProjectKey(this.project.id, key)
            .subscribe(
            project => this.project = project,
            err => console.log(err),
            () => this.deleteKeyPending = false
            );
    }

    updateProjectKey(projectId: string, oldKey: string, newKey: string) {
        this.updateKeyPending = true;
        this.projectsService.updateProjectKey(this.project.id, oldKey, newKey)
            .subscribe(
            project => this.project = project,
            err => console.log(err),
            () => this.updateKeyPending = false
            );
    }
}