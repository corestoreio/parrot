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
    private submit;
    @Input()
    private pending: boolean;
    @Input()
    set key(value: string) {
        if (!value) {
            return;
        }
        this.restoreService.setOriginal(value);
    }

    set _key(value: string) {
        this.restoreService.setCurrent(value);
    }
    get _key(): string {
        return this.restoreService.getCurrent();
    }

    private modalOpen: boolean;

    constructor(
        private restoreService: RestoreItemService<string>,
    ) {
        this.commitChanges = this.commitChanges.bind(this);
    }

    commitChanges() {
        this.submit(this.restoreService.getOriginal(), this.restoreService.getCurrent())
        this.closeModal();
        // TODO handle failed case
    }

    openModal() {
        this.modalOpen = true;
    }

    closeModal() {
        this.modalOpen = false;
        this.restoreService.restoreOriginal();
    }
}
