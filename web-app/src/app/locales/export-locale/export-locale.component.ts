import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LocalesService } from './../services/locales.service';
import { ExportFormat } from './../../app.config';

@Component({
    selector: 'export-locale',
    templateUrl: './export-locale.component.html',
    styleUrls: ['./export-locale.component.css']
})
export class ExportLocaleComponent implements OnInit {

    get formats(): ExportFormat[] {
        return this.service.availableExportFormats;
    }

    private selectedFormat = '';
    private modalOpen: boolean = false;
    private loading: boolean = false;
    private errors: string[];

    constructor(
        private route: ActivatedRoute,
        private service: LocalesService,
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
        this.selectedFormat = '';
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
            err => { this.errors = err; this.loading = false },
        )
    }
}
