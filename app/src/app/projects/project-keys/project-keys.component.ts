import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProjectsService } from './../services/projects.service';
import { RestoreItemService } from './../../shared/restore-item.service';

@Component({
    providers: [RestoreItemService],
    selector: 'project-keys',
    templateUrl: 'project-keys.component.html'
})
export class ProjectKeysComponent implements OnInit {
    private loading = false;
    private editing = false;

    constructor(
        private service: ProjectsService,
        private route: ActivatedRoute,
        private restoreService: RestoreItemService<Object>,
    ) { }

    ngOnInit() {
        this.fetchProject()
    }

    private fetchProject() {
        this.loading = true;
        let id = this.route.snapshot.params['projectId'];
        this.service.fetchProject(id).subscribe(
            res => {
                this.restoreService.setOriginal(res);
            },
            err => { console.log(err); },
            () => { this.loading = false; }
        )
    }

    get project() {
        return this.restoreService.getCurrent();
    }

    addKey() {
        this.project.keys.push("");
    }

    enableEdit() {
        this.editing = true;
    }

    cancelEdit() {
        this.editing = false;
        this.restoreService.restoreOriginal();
    }

    commitKeys() {
        this.editing = false;
        this.loading = true;
        this.service.updateProjectKeys(this.project.id, this.project.keys).subscribe(
            res => {
                this.restoreService.setOriginal(res);
            },
            err => { console.log(err); },
            () => { this.loading = false; }
        );
    }

    trackIndex(index: number, obj: string): number {
        return index;
    }
}