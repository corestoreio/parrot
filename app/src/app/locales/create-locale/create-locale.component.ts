import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LocalesService } from './../services/locales.service';
import { Locale, LocaleInfo } from './../model';

@Component({
    selector: 'create-locale',
    templateUrl: 'create-locale.component.html',
    styleUrls: ['create-locale.component.css']
})
export class CreateLocaleComponent {
    private selectedLocale: Locale;
    private availableLocales: LocaleInfo[] = [];

    private searchString: string;
    private modalOpen: boolean;
    private loading: boolean;
    private errors: string[];

    constructor(private localesService: LocalesService, private route: ActivatedRoute) {
        this.reset();
        this.localesService.locales
            .subscribe(existingLocales => this.availableLocales = this.computeAvailableLocales(existingLocales));
    }

    filteredLocales() {
        let str = this.searchString || '';
        return this.availableLocales.filter(locale => {
            let v = `${locale.ident} ${locale.country} ${locale.language}`.toLowerCase();
            return v.includes(str.toLowerCase());
        });
    }

    select(locale: Locale) {
        this.selectedLocale = locale;
    }

    deselect() {
        this.selectedLocale = null;
    }

    openModal() {
        this.modalOpen = true;
    }

    closeModal() {
        this.modalOpen = false;
        this.reset();
    }

    reset() {
        this.deselect();
        this.searchString = '';
    }

    computeAvailableLocales(existingLocales: Locale[]): LocaleInfo[] {
        return this.localesService.localeInfoList
            .filter(localeInfo => !existingLocales.find(locale => locale.ident === localeInfo.ident));
    }

    submit() {
        this.loading = true;
        let projectId = this.route.snapshot.params['projectId'];
        this.localesService.createLocale(projectId, this.selectedLocale).subscribe(
            () => { },
            err => { this.errors = err; this.loading = false; },
            () => {
                this.loading = false;
                this.closeModal();
            }
        );
    }
}