import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LocalesService } from './../services/locales.service';

@Component({
    selector: 'create-locale',
    templateUrl: 'create-locale.component.html'
})
export class CreateLocaleComponent {
    constructor(private localesService: LocalesService, private route: ActivatedRoute) {
        this.createLocale = this.createLocale.bind(this);
    }

    createLocale(locale) {
        let projectId = +this.route.snapshot.params['projectId'];
        this.localesService.createLocale(projectId, locale).subscribe(
            res => { },
            err => { console.log(err); }
        )
    }
}