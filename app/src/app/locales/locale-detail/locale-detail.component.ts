import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LocalesService } from './../services/locales.service';

@Component({
    selector: 'locale-detail',
    templateUrl: './locale-detail.component.html'
})
export class LocaleDetailComponent {
    private locale;
    private localPairs = [];
    private loading = false;
    private editing = false;

    constructor(private localesService: LocalesService, private route: ActivatedRoute) { }

    ngOnInit() {
        let projectId = +this.route.snapshot.params['projectId'];
        let localeIdent = this.route.snapshot.params['localeIdent'];
        this.loading = true;
        this.localesService.fetchLocale(projectId, localeIdent).subscribe(
            res => { this.locale = res; this.modelToLocalCopy(); },
            err => { console.log(err); },
            () => { this.loading = false; }
        );
    }

    enableEdit() {
        this.editing = true;
    }

    modelToLocalCopy() {
        this.localPairs = Object.assign({}, this.locale.pairs);
    }

    commitPairs() {
        this.loading = true;
        this.editing = false;
        this.localesService.updateLocalePairs(
            this.locale.project_id,
            this.locale.ident,
            this.localPairs,
        )
            .subscribe(
            result => { this.locale = result; this.modelToLocalCopy(); },
            err => { console.log(err); },
            () => { this.loading = false; },
        )
    }
}
