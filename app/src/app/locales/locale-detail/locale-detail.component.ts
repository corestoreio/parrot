import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LocalesService } from './../services/locales.service';

@Component({
    selector: 'locale-detail',
    templateUrl: './locale-detail.component.html'
})
export class LocaleDetailComponent {
    private locale;

    constructor(private localesService: LocalesService, private route: ActivatedRoute) {
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
            err => { console.log(err); }
        )
    }
}
