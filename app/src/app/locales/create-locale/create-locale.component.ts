import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LocalesService } from './../services/locales.service';

@Component({
    selector: 'create-locale',
    templateUrl: 'create-locale.component.html'
})
export class CreateLocaleComponent {
    private locale;
    private modalOpen = false;
    private loading = false;

    constructor(private localesService: LocalesService, private route: ActivatedRoute) {
        this.resetFormModel();
        this.createLocale = this.createLocale.bind(this);
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
            ident: '',
            country: '',
            language: ''
        };
    }

    createLocale() {
        this.loading = true;
        let projectId = this.route.snapshot.params['projectId'];
        this.localesService.createLocale(projectId, this.locale).subscribe(
            () => { },
            err => { console.log(err); },
            () => {
                this.loading = false;
                this.closeModal();
                this.resetFormModel();
            }
        )
    }
}