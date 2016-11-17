import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LocalesService } from './locales.service';

@Component({
    selector: 'locales',
    templateUrl: './locales.component.html'
})
export class LocalesComponent {
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