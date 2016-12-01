import { Component, Input } from '@angular/core';

import { Locale } from './../model/locale';

@Component({
    selector: 'locales-list',
    templateUrl: './locales-list.component.html',
    styleUrls: ['locales-list.component.css']
})
export class LocalesListComponent {
    @Input()
    private loading: boolean;
    @Input()
    private searchString: string;
    @Input()
    private locales: Locale[];

    constructor() {
        this.locales = [];
    }

    filterLocales(str: string) {
        return this.locales.filter(locale => {
            let v = `${locale.ident} ${locale.country} ${locale.language}`.toLowerCase();
            return v.includes(str.toLowerCase());
        });
    }
}