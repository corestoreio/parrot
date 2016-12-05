import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';

import { LocalesService } from './../../locales/services/locales.service';
import { Locale } from './../../locales/model/locale';

@Component({
    providers: [LocalesService],
    selector: 'project-locales-page',
    templateUrl: 'project-locales-page.component.html',
    styleUrls: ['project-locales-page.component.css']
})
export class ProjectLocalesPage implements OnInit {
    private project;
    private locales: Locale[];
    private loadingProject = false;
    private loadingLocales = false;
    private searchString: string;

    constructor(
        private route: ActivatedRoute,
        private localesService: LocalesService
    ) { }

    ngOnInit() {
        this.route.params
            .map(params => params['projectId'])
            .subscribe(projectId => {
                this.fetchLocales(projectId);
            });

        this.localesService.locales
            .subscribe(locales => this.locales = locales);
    }

    onSearch(event: any) {
        this.searchString = event.target.value;
    }

    fetchLocales(projectId) {
        this.loadingLocales = true;
        this.localesService.fetchLocales(projectId)
            .subscribe(
            locales => { this.locales = locales; },
            err => console.log(err),
            () => this.loadingLocales = false,
        );
    }
}