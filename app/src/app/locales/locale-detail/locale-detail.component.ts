import { Component, OnInit, Input } from '@angular/core';

import { RestoreItemService } from './../../shared/restore-item.service';
import { Locale } from './../model/locale';

@Component({
    providers: [RestoreItemService],
    selector: 'locale-detail',
    templateUrl: './locale-detail.component.html',
    styleUrls: ['locale-detail.component.css']
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

    get percentTranslated(): number {
        let percent = 0;
        if (this.locale) {
            let filled = 0;
            let pairs = this.locale.pairs;
            let keys = Object.keys(pairs);
            keys.forEach(key => {
                let v = pairs[key];
                if (v && v.length > 0) {
                    filled++;
                }
            });
            percent = Math.round((filled / keys.length) * 100);
        }
        return percent;
    }

    private editing: boolean = false;

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
