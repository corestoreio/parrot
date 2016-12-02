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
    private commitKey;
    @Input()
    private addKeyPending: boolean;

    private error: string;
    private newKey: string;

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

    commit() {
        this.commitKey(this.project.id, this.newKey);
    }
}
