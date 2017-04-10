import { Component, OnInit, Input } from '@angular/core';

import { Project } from './../model/project';
import { ProjectsService } from './../../projects/services/projects.service';

@Component({
    selector: 'project-keys',
    templateUrl: 'project-keys.component.html'
})
export class ProjectKeysComponent implements OnInit {
    @Input()
    project: Project;
    @Input()
    public loading: boolean;
    @Input()
    private editable: boolean;

    private addKeyPending: boolean = false;
    private deleteKeyPending: boolean = false;

    constructor(
        private projectsService: ProjectsService,
    ) {
        this.addKey = this.addKey.bind(this);
        this.deleteKey = this.deleteKey.bind(this);
        this.updateKey = this.updateKey.bind(this);
    }

    ngOnInit() { }

    addKey(key: string) {
        this.addKeyPending = true;
        this.projectsService.addProjectKey(this.project.id, key)
            .subscribe(
            project => this.project = project,
            err => console.log(err),
            () => this.addKeyPending = false,
        );
    }

    updateKey(oldKey: string, newKey: string) {
        this.projectsService.updateProjectKey(this.project.id, oldKey, newKey)
            .subscribe(
            project => this.project = project,
            err => console.log(err),
        );
    }

    deleteKey(key: string) {
        this.deleteKeyPending = true;
        this.projectsService.deleteProjectKey(this.project.id, key)
            .subscribe(
            project => this.project = project,
            err => console.log(err),
            () => this.deleteKeyPending = false,
        );
    }

    trackIndex(index: number, obj: string): number {
        return index;
    }
}
