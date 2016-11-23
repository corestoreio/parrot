import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProjectsService } from './../services/projects.service';

@Component({
    selector: 'project-keys',
    templateUrl: 'project-keys.component.html'
})
export class ProjectKeysComponent implements OnInit {
    private project;
    private formKeys = [];
    private loading = false;
    private editing = false;

    constructor(private service: ProjectsService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.fetchProject()
    }

    private fetchProject() {
        this.loading = true;
        let id = +this.route.snapshot.params['projectId'];
        this.service.getProject(id).subscribe(
            res => {
                this.project = res;
                this.modelToLocalCopy();
            },
            err => { console.log(err); },
            () => { this.loading = false; }
        )
    }

    addKey() {
        this.formKeys.push("");
    }

    enableEdit() {
        this.editing = true;
    }

    cancelEdit() {
        this.editing = false;
        this.modelToLocalCopy();
    }

    modelToLocalCopy() {
        this.formKeys = [...this.project.keys];
    }

    commitKeys() {
        this.editing = false;
        this.loading = true;
        this.service.updateProjectKeys(this.project.id, this.formKeys).subscribe(
            res => {
                this.project = res;
                this.modelToLocalCopy();
            },
            err => { console.log(err); },
            () => { this.loading = false; }
        );
    }

    trackIndex(index: number, obj: string): number {
        return index;
    }
}