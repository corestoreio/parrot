import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/switchMapTo';

import { Application } from './../../api-access/model/app';
import { APIAccessService } from './../../api-access/services/api-access.service';

@Component({
    selector: 'api-app-page',
    templateUrl: 'api-app-page.component.html'
})
export class APIAppPage implements OnInit {
    private app: Application;
    private projectId: string;
    private loading: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private apiAccess: APIAccessService,
    ) { }

    ngOnInit() {
        this.route.parent.params
            .map(params => params['projectId'])
            .map(projectId => { this.projectId = projectId; })
            .switchMapTo(this.route.params)
            .map(params => params['clientId'])
            .subscribe(clientId => {
                this.fetchApp(this.projectId, clientId);
            });
    }

    fetchApp(projectId: string, clientId: string) {
        this.loading = true;
        this.apiAccess.fetchApp(projectId, clientId)
            .subscribe(
            app => this.app = app,
            err => console.log(err),
            () => this.loading = false,
        );
    }
}