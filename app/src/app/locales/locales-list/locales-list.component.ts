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

    constructor(private localesService: LocalesService, private route: ActivatedRoute) {
        this.fetchLocales = this.fetchLocales.bind(this);
    }

    ngOnInit() {
        this.localesService.locales.subscribe(
            locales => { this.locales = locales }
        );
        let projectId = this.route.snapshot.params['projectId'];
        this.fetchLocales(projectId);
    }

    fetchLocales(projectId: number) {
        this.loading = true;
        this.localesService.fetchLocales(projectId).subscribe(
            () => { },
            err => { console.log(err); },
            () => { this.loading = false; }
        );
    }
}