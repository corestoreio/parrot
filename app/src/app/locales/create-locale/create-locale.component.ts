import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LocalesService } from './../services/locales.service';
import { Locale, LocaleInfo } from './../model';

@Component({
    selector: 'create-locale',
    templateUrl: 'create-locale.component.html'
})
export class CreateLocaleComponent {
    private locale: Locale;
    private availableLocales: LocaleInfo[] = [];

    private searchString: string;
    private modalOpen: boolean;
    private loading: boolean;
    private errors: string[];

    constructor(private localesService: LocalesService, private route: ActivatedRoute) {
        this.resetFormModel();
        this.createLocale = this.createLocale.bind(this);
        this.localesService.locales
            .subscribe(locales => this.availableLocales = this.computeAvailableLocales(locales));
    }

    onSearch(event: any) {
        this.searchString = event.target.value;
    }

    filteredLocales() {
        let str = this.searchString || '';
        return this.availableLocales.filter(locale => {
            let v = `${locale.ident} ${locale.country} ${locale.language}`.toLowerCase();
            return v.includes(str.toLowerCase());
        });
    }

    select(locale: Locale) {
        console.log("SELECTED: ", locale.ident);
    }

    openModal() {
        this.modalOpen = true;
    }

    closeModal() {
        this.modalOpen = false;
        this.resetFormModel();
    }

    resetFormModel() {
        this.locale = {
            id: '',
            ident: '',
            country: '',
            language: '',
            project_id: '',
            pairs: {},
        };
    }

    computeAvailableLocales(locales: Locale[]): LocaleInfo[] {
        const contains = (list: Locale[], ident: string): boolean => !!list.find(locale => locale.ident === ident);

        return this.localesService.localeInfoList
            .filter(localeInfo => !contains(locales, localeInfo.ident));
    }

    createLocale() {
        this.loading = true;
        let projectId = this.route.snapshot.params['projectId'];
        this.localesService.createLocale(projectId, this.locale).subscribe(
            () => { },
            err => { this.errors = err; this.loading = false; },
            () => {
                this.loading = false;
                this.closeModal();
                this.resetFormModel();
            }
        );
    }
}