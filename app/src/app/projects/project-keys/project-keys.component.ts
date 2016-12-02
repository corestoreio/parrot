import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Project } from './../model/project';

@Component({
    selector: 'project-keys',
    templateUrl: 'project-keys.component.html'
})
export class ProjectKeysComponent implements OnInit {
    @Input()
    private deleteKey;
    @Input()
    private updateProjectKey;
    @Input()
    private loading: boolean;
    @Input()
    project: Project;

    constructor() { }

    ngOnInit() { }

    updateKey(oldKey: string, newKey: string) {
        this.updateProjectKey(this.project.id, oldKey, newKey);
    }

    trackIndex(index: number, obj: string): number {
        return index;
    }
}