import { Component, OnInit, Input } from '@angular/core';

import { RestoreItemService } from './../../shared/restore-item.service';

@Component({
    providers: [RestoreItemService],
    selector: 'locale-detail',
    templateUrl: './locale-detail.component.html'
})
export class LocaleDetailComponent {
    @Input()
    private loading;
    @Input()
    private onCommitPairs;

    @Input()
    set locale(value) {
        if (!value) {
            return;
        }
        this.restoreService.setOriginal(value);
    }

    get locale(): any {
        return this.restoreService.getCurrent();
    }

    private editing = false;

    constructor(private restoreService: RestoreItemService<Object>) { }

    ngOnInit() { }

    enableEdit() {
        this.editing = true;
    }

    cancelEdit() {
        this.editing = false;
        this.restoreService.restoreOriginal();
    }

    commitPairs() {
        this.editing = false;
        this.onCommitPairs(
            this.locale.project_id,
            this.locale.ident,
            this.locale.pairs,
        );
    }
}
