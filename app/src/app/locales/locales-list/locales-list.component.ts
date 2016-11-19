import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LocalesService } from './../services/locales.service';

@Component({
    selector: 'locales-list',
    templateUrl: './locales-list.component.html'
})
export class LocalesListComponent {
    locales;

    constructor(private service: LocalesService, private route: ActivatedRoute) {
        this.locales = [];
    }

    ngOnInit() {
        this.getLocales();
    }

    getLocales() {
        let projectId = this.route.snapshot.params['projectId'];
        this.service.getLocales(projectId).subscribe(
            res => { this.locales = res; },
            err => { },
            () => { }
        )
    }

}