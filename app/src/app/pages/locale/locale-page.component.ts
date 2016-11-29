import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LocalesService } from './../../locales/services/locales.service';

@Component({
    providers: [LocalesService],
    selector: 'locale-page',
    templateUrl: 'locale-page.component.html'
})
export class LocalePage implements OnInit {
    private locale;
    private loading = false;
    private updatePairsPending = false;

    constructor(
        private route: ActivatedRoute,
        private localesService: LocalesService
    ) {
        this.updatePairs = this.updatePairs.bind(this);
    }

    ngOnInit() {
        this.route.params
            .map(params => ({ projectId: params['projectId'], localeIdent: params['localeIdent'] }))
            .subscribe(data => {
                this.fetchLocale(data.projectId, data.localeIdent);
            });
    }

    fetchLocale(projectId, localeIdent) {
        this.loading = true;
        this.localesService.fetchLocale(projectId, localeIdent)
            .subscribe(
            locale => { this.locale = locale },
            err => console.log(err),
            () => this.loading = false,
        );
    }

    updatePairs(projectId, localeIdent, pairs) {
        this.updatePairsPending = true;
        this.localesService.updateLocalePairs(projectId, localeIdent, pairs)
            .subscribe(
            locale => { this.locale = locale },
            err => console.log(err),
            () => this.updatePairsPending = false,
        );
    }
}