import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/switchMapTo';
import 'rxjs/add/operator/do';

import { ProjectClient } from './../../api-access/model/app';
import { APIAccessService } from './../../api-access/services/api-access.service';
import { ErrorsService } from './../../shared/errors.service';

@Component({
    selector: 'api-app-page',
    templateUrl: 'api-app-page.component.html'
})
export class APIAppPage implements OnInit {
    private projectClient: ProjectClient;
    private projectId: string;
    private clientId: string;
    private loading: boolean = false;
    private errors;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private apiAccess: APIAccessService,
        private errorsService: ErrorsService,
    ) {
        this.deleteProjectClient = this.deleteProjectClient.bind(this);
        this.updateProjectClient = this.updateProjectClient.bind(this);
        this.resetSecret = this.resetSecret.bind(this);
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
        this.apiAccess.fetchProjectClient(this.projectId, this.clientId)
            .subscribe(
            app => this.projectClient = app,
            err => console.error(err),
            () => this.loading = false,
        );
    }

    deleteProjectClient() {
        this.loading = true;
        this.apiAccess.deleteProjectClient(this.projectId, this.clientId)
            .subscribe(
            () => this.router.navigate(['/projects', this.projectId, 'api']),
            err => console.error(err),
            () => this.loading = false,
        );
    }

    resetSecret() {
        this.loading = true;
        this.apiAccess.resetProjectClientSecret(this.projectId, this.clientId)
            .subscribe(
            app => this.projectClient = app,
            err => console.error(err),
            () => this.loading = false,
        );
    }

    updateProjectClient(projectClient: ProjectClient) {
        this.loading = true;
        this.apiAccess.updateProjectClientName(this.projectId, projectClient)
            .subscribe(
            client => this.projectClient = client,
            err => {
                this.errors = this.errorsService.mapErrors(err, 'UpdateProjectClient');
            },
            () => this.loading = false,
        );
    }
}