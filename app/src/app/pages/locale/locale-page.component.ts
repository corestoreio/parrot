import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LocalesService } from './../../locales';

@Component({
    selector: 'locale-page',
    templateUrl: 'locale-page.component.html'
})
export class LocalePageComponent implements OnInit {
    private locale;

    constructor(
        private localesService: LocalesService,
        private route: ActivatedRoute
    ) {
        this.getLocale = this.getLocale.bind(this);
    }

    ngOnInit() {
        let projectId = +this.route.snapshot.params['projectId'];
        let localeIdent = this.route.snapshot.params['localeIdent'];
        this.getLocale(projectId, localeIdent);
    }


    getLocale(projectId: number, localeIdent: string) {
        this.localesService.getLocale(projectId, localeIdent).subscribe(
            res => { this.locale = res; },
            err => { },
            () => { }
        )
    }
}