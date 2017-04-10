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
    set locales(value: Locale[]) {
        if (!value) {
            return;
        }
        this._locales = value;
        this.searchString = '';
    }

    set searchString(value: string) {
        this._searchString = value;
        this.filterLocales(value);
    }

    get searchString(): string {
        return this._searchString;
    }

    private _searchString: string;
    private _locales: Locale[] = [];
    public _filteredLocales: Locale[]

    constructor() { }

    filterLocales(str: string = '') {
        this._filteredLocales = this._locales.filter(locale => {
            let v = `${locale.ident} ${locale.country} ${locale.language}`.toLowerCase();
            return v.includes(str.toLowerCase());
        });
    }
}
