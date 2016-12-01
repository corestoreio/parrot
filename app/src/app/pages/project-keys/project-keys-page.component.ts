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
    private loading = false;
    private createKeyPending = false;
    private newKeyError: string;
    private newKey: string;

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

    keyValid() {
        let key = this.newKey;
        if (!key) {
            return false;
        }
        if (key.trim().length == 0) {
            this.newKeyError = "Cannot create empty key.";
            return false;
        }
        let exists = this.project.keys.find(pkey => pkey === key);
        if (exists) {
            this.newKeyError = "Key already exists.";
            return false;
        }
        return true;
    }

    commitKey() {
        let keys = this.project.keys.concat(this.newKey);
        this.updateProjectKeys(this.project.id, keys);
    }

    updateProjectKeys(projectId, keys) {
        this.createKeyPending = true;
        this.projectsService.updateProjectKeys(projectId, keys)
            .subscribe(
            project => { this.project = project; this.newKey = ''; },
            err => console.log(err),
            () => this.createKeyPending = false,
        );
    }
}