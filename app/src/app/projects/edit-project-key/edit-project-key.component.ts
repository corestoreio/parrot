import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { Project } from './../model/project';
import { RestoreItemService } from './../../shared/restore-item.service';

@Component({
    providers: [RestoreItemService],
    selector: 'edit-project-key',
    templateUrl: './edit-project-key.component.html'
})
export class EditProjectKeyComponent {
    @Input()
    private updateKey;
    @Input()
    private pending: boolean;
    @Input()
    set key(value: string) {
        if (!value) {
            return;
        }
        this.restoreService.setOriginal(value);
        this._key = value;
    }

    private _key: string;

    private modalOpen: boolean;

    constructor(private restoreService: RestoreItemService<string>) { }

    openModal() {
        this.modalOpen = true;
    }

    closeModal() {
        this.modalOpen = false;
        this.restoreService.restoreOriginal();
        this._key = this.restoreService.getCurrent();
    }

    commit() {
        this.updateKey(this.restoreService.getOriginal(), this._key);
    }
}
