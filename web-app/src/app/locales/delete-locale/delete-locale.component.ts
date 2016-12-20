import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Locale } from './../model/locale';
import { LocalesService } from './../services/locales.service';
import { ErrorsService } from './../../shared/errors.service';

@Component({
    selector: 'delete-locale',
    templateUrl: 'delete-locale.component.html'
})
export class DeleteLocaleComponent implements OnInit {
    @Input()
    private pending: boolean = false;
    @Input()
    private locale: Locale;
    @Input()
    private submit;

    private repeatIdent: string;
    private modalOpen: boolean;
    private loading: boolean;
    private errors: string[];

    constructor(
        private service: LocalesService,
        private errorsService: ErrorsService,
        private router: Router,
    ) { }


    ngOnInit() { }

    confirm() {
        if (!this.locale) {
            console.error("no locale set");
            return;
        }
        this.loading = true;
        let projectId = this.locale.project_id;
        this.service.deleteLocale(this.locale.project_id, this.locale.ident)
            .subscribe(
            () => { this.loading = false; this.router.navigate(['/projects', projectId, 'locales']) },
            err => {
                this.errors = this.errorsService.mapErrors(err, 'DeleteLocale');
                this.loading = false;
            },
        );
    }

    openModal() {
        this.modalOpen = true;
    }

    closeModal() {
        this.modalOpen = false;
        this.reset();
    }

    valid(): boolean {
        if (!this.repeatIdent) {
            return false;
        }
        if (this.repeatIdent.length <= 0) {
            return false;
        }
        return this.repeatIdent === this.locale.ident;
    }

    reset() {
        this.repeatIdent = '';
    }
}