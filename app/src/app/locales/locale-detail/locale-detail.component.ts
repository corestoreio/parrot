import { Component, OnInit, Input } from '@angular/core';

import { RestoreItemService } from './../../shared/restore-item.service';
import { Locale } from './../model/locale';

@Component({
    providers: [RestoreItemService],
    selector: 'locale-detail',
    templateUrl: './locale-detail.component.html'
})
export class LocaleDetailComponent {
    @Input()
    private loading: boolean;
    @Input()
    private onCommitPairs: Function;

    @Input()
    set locale(value: Locale) {
        if (!value) {
            return;
        }
        this.restoreService.setOriginal(value);
    }

    get locale(): Locale {
        return this.restoreService.getCurrent();
    }

    private editing = false;

    constructor(private restoreService: RestoreItemService<Locale>) { }

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
