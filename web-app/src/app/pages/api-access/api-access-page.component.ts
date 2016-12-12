import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { ProjectClient } from './../../api-access/model/app';
import { APIAccessService } from './../../api-access/services/api-access.service';

@Component({
    selector: 'api-access-page',
    templateUrl: 'api-access-page.component.html'
})
export class APIAccessPage implements OnInit {
    private projectClients: ProjectClient[];
    private loading: boolean = false;
    private projectId: string;

    constructor(
        private route: ActivatedRoute,
        private apiAccess: APIAccessService,
    ) { }

    ngOnInit() {
        this.apiAccess.projectClients
            .subscribe(clients => this.projectClients = clients);

        this.route.parent.params
            .map(params => params['projectId'])
            .do(projectId => this.projectId = projectId)
            .subscribe(projectId => {
                this.fetchApps(projectId);
            });
    }

    fetchApps(projectId: string) {
        this.loading = true;
        this.apiAccess.fetchProjectClients(projectId)
            .subscribe(
            () => { },
            err => console.log(err),
            () => this.loading = false,
        );
    }
}