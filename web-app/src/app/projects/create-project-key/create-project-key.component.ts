import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { Project } from './../model/project';
import { ProjectsService } from './../services/projects.service';

@Component({
    selector: 'create-project-key',
    templateUrl: './create-project-key.component.html'
})
export class CreateProjectKeyComponent {
    @Input()
    private project: Project;
    @Input()
    private submit;
    @Input()
    set pending(value: boolean) {
        if (this._pending && value === false) {
            this.reset();
        }
        this._pending = value;
    }

    get pending(): boolean {
        return this._pending;
    }

    private _pending: boolean;
    private error: string;
    public newKey: string;

    keyValid() {
        let key = this.newKey;
        if (!key) {
            return false;
        }
        key = key.trim();
        if (key.length == 0) {
            this.error = "Cannot create empty key.";
            return false;
        }
        let exists = this.project.keys.find(pkey => pkey === key);
        if (exists) {
            this.error = "Key already exists.";
            return false;
        }
        return true;
    }

    reset() {
        this.newKey = '';
        this.error = '';
    }

    commit() {
        this.submit(this.newKey);
    }
}
