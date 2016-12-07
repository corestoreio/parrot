import { Component, OnInit, Input } from '@angular/core';

import { ProjectClient } from './../model/app';
import { RestoreItemService } from './../../shared/restore-item.service';

@Component({
    providers: [RestoreItemService],
    selector: 'app-detail',
    templateUrl: 'app-detail.component.html',
    styleUrls: ['app-detail.component.css']
})
export class AppDetailComponent implements OnInit {
    @Input()
    updateProjectClient;
    @Input()
    resetSecret;
    @Input()
    set projectClient(value: ProjectClient) {
        if (!value) {
            return;
        }
        // TODO: find a better solution for the restore service to coordinate with changes detection
        this.restoreService.setOriginal(value);
        this._projectClient = this.restoreService.getCurrent();
    }

    set _projectClient(value: ProjectClient) {
        this.restoreService.setCurrent(value);
    }

    get _projectClient(): ProjectClient {
        return this.restoreService.getCurrent();
    }

    constructor(private restoreService: RestoreItemService<ProjectClient>) { }

    ngOnInit() { }

    cancelChanges() {
        this.restoreService.restoreOriginal();
    }

    saveChanges() {
        this.updateProjectClient(this.restoreService.getCurrent())
    }

    resetSecretPrompt() {
        let c = confirm('Reset client secret?');
        if (!c) {
            return;
        }
        this.resetSecret();
    }
}