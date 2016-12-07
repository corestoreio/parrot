import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/switchMapTo';
import 'rxjs/add/operator/do';

import { Application } from './../../api-access/model/app';
import { APIAccessService } from './../../api-access/services/api-access.service';

@Component({
    selector: 'api-app-page',
    templateUrl: 'api-app-page.component.html'
})
export class APIAppPage implements OnInit {
    private app: Application;
    private projectId: string;
    private clientId: string;
    private loading: boolean = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private apiAccess: APIAccessService,
    ) {
        this.deleteApp = this.deleteApp.bind(this);
    }

    ngOnInit() {
        this.route.parent.params
            .map(params => params['projectId'])
            .do(projectId => this.projectId = projectId)
            .switchMapTo(this.route.params)
            .map(params => params['clientId'])
            .do(clientId => this.clientId = clientId)
            .subscribe(() => {
                this.fetchApp();
            });
    }

    fetchApp() {
        this.loading = true;
        this.apiAccess.fetchApp(this.projectId, this.clientId)
            .subscribe(
            app => this.app = app,
            err => console.log(err),
            () => this.loading = false,
        );
    }

    deleteApp() {
        this.loading = true;
        this.apiAccess.deleteApp(this.projectId, this.clientId)
            .subscribe(
            () => this.router.navigate(['/projects', this.projectId, 'api']),
            err => console.log(err),
            () => this.loading = false,
        );
    }
}