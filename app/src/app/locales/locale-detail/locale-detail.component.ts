import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LocalesService } from './../services/locales.service';
import { RestoreItemService } from './../../shared/restore-item.service';

@Component({
    providers: [RestoreItemService],
    selector: 'locale-detail',
    templateUrl: './locale-detail.component.html'
})
export class LocaleDetailComponent {
    private loading = false;
    private editing = false;

    constructor(private localesService: LocalesService,
        private route: ActivatedRoute,
        private restoreService: RestoreItemService<Object>,
    ) { }

    ngOnInit() {
        let projectId = this.route.snapshot.params['projectId'];
        let localeIdent = this.route.snapshot.params['localeIdent'];
        this.loading = true;
        this.localesService.fetchLocale(projectId, localeIdent).subscribe(
            res => {
                this.restoreService.setOriginal(res);
            },
            err => { console.log(err); },
            () => { this.loading = false; }
        );
    }

    get locale(): any {
        return this.restoreService.getCurrent();
    }

    enableEdit() {
        this.editing = true;
    }

    cancelEdit() {
        this.editing = false;
        this.restoreService.restoreOriginal();
    }

    commitPairs() {
        this.loading = true;
        this.editing = false;
        this.localesService.updateLocalePairs(
            this.locale.project_id,
            this.locale.ident,
            this.locale.pairs,
        )
            .subscribe(
            result => {
                this.restoreService.setOriginal(result);
            },
            err => { console.log(err); },
            () => { this.loading = false; },
        )
    }
}
