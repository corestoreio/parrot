import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LocalesService } from './../services/locales.service';
import { ExportFormat } from './../../app.config';
import { ErrorsService } from './../../shared/errors.service';

@Component({
    selector: 'export-locale',
    templateUrl: './export-locale.component.html',
    styleUrls: ['./export-locale.component.css']
})
export class ExportLocaleComponent implements OnInit {

    get formats(): ExportFormat[] {
        return this.service.availableExportFormats;
    }

    private selectedFormat: ExportFormat;
    private modalOpen: boolean = false;
    private loading: boolean = false;
    private errors: string[];

    constructor(
        private route: ActivatedRoute,
        private service: LocalesService,
        private errorsService: ErrorsService,
    ) { }

    ngOnInit() { }

    openModal() {
        this.modalOpen = true;
    }

    closeModal() {
        this.modalOpen = false;
        this.reset();
    }

    reset() {
        this.selectedFormat = null;
        this.loading = false;
        this.errors = [];
    }

    submit() {
        this.loading = true;
        let projectId = this.route.parent.snapshot.params['projectId'];
        let localeIdent = this.route.snapshot.params['localeIdent'];
        this.service.requestExport(projectId, localeIdent, this.selectedFormat)
            .subscribe(
            () => {
                this.closeModal();
            },
            err => {
                this.errors = this.errorsService.mapErrors(err, 'CreateLocale');
                this.loading = false;
            },
        )
    }
}
