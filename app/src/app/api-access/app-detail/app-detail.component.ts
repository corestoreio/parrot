import { Component, OnInit, Input } from '@angular/core';

import { Application } from './../model/app';
import { RestoreItemService } from './../../shared/restore-item.service';

@Component({
    providers: [RestoreItemService],
    selector: 'app-detail',
    templateUrl: 'app-detail.component.html',
    styleUrls: ['app-detail.component.css']
})
export class AppDetailComponent implements OnInit {
    @Input()
    updateApp;
    @Input()
    resetSecret;
    @Input()
    set app(value: Application) {
        if (!value) {
            return;
        }
        // TODO: find a better solution for the restore service to coordinate with changes detection
        this.restoreService.setOriginal(value);
        this._app = value;
    }

    set _app(value: Application) {
        this.restoreService.setCurrent(value);
    }

    get _app(): Application {
        return this.restoreService.getCurrent();
    }

    constructor(private restoreService: RestoreItemService<Application>) { }

    ngOnInit() { }

    cancelChanges() {
        this.restoreService.restoreOriginal();
    }

    saveChanges() {
        this.updateApp(this.restoreService.getCurrent())
    }

    resetSecretPrompt() {
        let c = confirm('Reset app secret?');
        if (!c) {
            return;
        }
        this.resetSecret();
    }
}