import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';

import { UserService } from './../../users/services/user.service';
import { LocalesService } from './../../locales/services/locales.service';
import { Locale } from './../../locales/model/locale';

@Component({
    providers: [LocalesService],
    selector: 'project-locales-page',
    templateUrl: 'project-locales-page.component.html',
    styleUrls: ['project-locales-page.component.css']
})
export class ProjectLocalesPage implements OnInit {
    private locales: Locale[];
    private loading: boolean;
    private protectedVisible: boolean;

    constructor(
        private route: ActivatedRoute,
        private localesService: LocalesService,
        private userService: UserService,
    ) {
    }

    ngOnInit() {
        this.route.params
            .map(params => params['projectId'])
            .subscribe(projectId => {
                this.fetchLocales(projectId);
                this.userService.isAuthorized(projectId, 'CanCreateLocales')
                    .subscribe(ok => this.protectedVisible = ok);
            });

        this.localesService.locales
            .subscribe(locales => this.locales = locales);
    }

    fetchLocales(projectId) {
        this.loading = true;
        this.localesService.fetchLocales(projectId)
            .subscribe(
            () => { },
            err => console.log(err),
            () => this.loading = false,
        );
    }
}