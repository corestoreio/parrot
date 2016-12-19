import { Component, OnInit, Input } from '@angular/core';

import { RestoreItemService } from './../../shared/restore-item.service';
import { Locale } from './../model/locale';
import { LocalesService } from './../services/locales.service';


@Component({
    providers: [RestoreItemService],
    selector: 'locale-pairs',
    templateUrl: './locale-pairs.component.html',
    styleUrls: ['locale-pairs.component.css']
})
export class LocalePairsComponent {
    @Input()
    private loading: boolean = false;
    @Input()
    private editable: boolean = false;

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
            if (keys.length <= 0) {
                return 0;
            }
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
    private updatePending: boolean = false;

    constructor(
        private restoreService: RestoreItemService<Locale>,
        private localesService: LocalesService,
    ) {
    }

    ngOnInit() { }

    enableEdit() {
        this.editing = true;
    }

    cancelEdit() {
        this.editing = false;
        this.restoreService.restoreOriginal();
    }

    commitPairs(projectId, localeIdent, pairs) {
        this.updatePending = true;
        this.localesService.updateLocalePairs(this.locale.project_id, this.locale.ident, this.locale.pairs)
            .subscribe(
            locale => { this.locale = locale; this.editing = false; },
            err => console.log(err),
            () => { this.updatePending = false }
            );
    }
}
