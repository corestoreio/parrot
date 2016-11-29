import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProjectsService } from './../services/projects.service';
import { RestoreItemService } from './../../shared/restore-item.service';

@Component({
    providers: [RestoreItemService],
    selector: 'project-keys',
    templateUrl: 'project-keys.component.html'
})
export class ProjectKeysComponent implements OnInit {
    @Input()
    private onCommitKeys;
    @Input()
    private loading = false;

    @Input()
    set project(value) {
        if (!value) {
            return;
        }
        this.restoreService.setOriginal(value);
    }

    private editing = false;

    get project() {
        return this.restoreService.getCurrent();
    }

    constructor(
        private service: ProjectsService,
        private route: ActivatedRoute,
        private restoreService: RestoreItemService<Object>,
    ) { }

    ngOnInit() { }

    addKey() {
        this.project.keys.push("");
        this.enableEdit();
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
        this.onCommitKeys(this.project.id, this.project.keys);
    }

    trackIndex(index: number, obj: string): number {
        return index;
    }
}