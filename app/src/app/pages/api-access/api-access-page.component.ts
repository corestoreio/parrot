import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { Application } from './../../api-access/model/app';
import { APIAccessService } from './../../api-access/services/api-access.service';

@Component({
    selector: 'api-access-page',
    templateUrl: 'api-access-page.component.html'
})
export class APIAccessPage implements OnInit {
    private apps: Application[];
    private loading: boolean = false;
    private projectId: string;

    constructor(
        private route: ActivatedRoute,
        private apiAccess: APIAccessService,
    ) { }

    ngOnInit() {
        this.apiAccess.apps
            .subscribe(apps => this.apps = apps);

        this.route.parent.params
            .map(params => params['projectId'])
            .do(projectId => this.projectId = projectId)
            .subscribe(projectId => {
                this.fetchApps(projectId);
            });
    }

    fetchApps(projectId: string) {
        this.loading = true;
        this.apiAccess.fetchApps(projectId)
            .subscribe(
            () => { },
            err => console.log(err),
            () => this.loading = false,
        );
    }
}