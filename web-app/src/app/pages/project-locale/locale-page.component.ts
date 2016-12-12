import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/switchMapTo';

import { LocalesService } from './../../locales/services/locales.service';
import { Locale } from './../../locales/model/locale';

@Component({
    providers: [LocalesService],
    selector: 'locale-page',
    templateUrl: 'locale-page.component.html'
})
export class LocalePage implements OnInit {
    private projectId: string;
    private locale: Locale;
    private loading = false;

    constructor(
        private route: ActivatedRoute,
        private localesService: LocalesService
    ) {
    }

    ngOnInit() {
        this.route.parent.params
            .map(params => params['projectId'])
            .map(projectId => { this.projectId = projectId; })
            .switchMapTo(this.route.params)
            .map(params => params['localeIdent'])
            .subscribe(localeIdent => {
                this.fetchLocale(this.projectId, localeIdent);
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
}