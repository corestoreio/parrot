import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LocalesService } from './../services/locales.service';

@Component({
    selector: 'locales-list',
    templateUrl: './locales-list.component.html'
})
export class LocalesListComponent implements OnInit {
    private locales = [];
    private loading = false;

    constructor(private localesService: LocalesService, private router: ActivatedRoute) { }

    ngOnInit() {
        this.localesService.locales.subscribe(
            locales => { this.locales = locales }
        );

        this.router.params
            .map(params => params['projectId'])
            .switchMap(projectId => {
                this.loading = true;
                return this.localesService.fetchLocales(projectId);
            })
            .subscribe(locales => {
                this.loading = false;
            }, err => {
                console.log(err); this.loading = false;
            });

    }
}