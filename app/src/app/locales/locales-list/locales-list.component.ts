import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LocalesService } from './../services/locales.service';

@Component({
    selector: 'locales-list',
    templateUrl: './locales-list.component.html'
})
export class LocalesListComponent implements OnInit {
    private locales = [];

    constructor(private localesService: LocalesService, private route: ActivatedRoute) {
        this.getLocales = this.getLocales.bind(this);
    }

    ngOnInit() {
        let projectId = +this.route.snapshot.params['projectId'];
        this.getLocales(projectId);
    }

    getLocales(projectId: number) {
        this.localesService.getLocales(projectId).subscribe(
            res => { this.locales = res; },
            err => { console.log(err); },
            () => { }
        )
    }
}