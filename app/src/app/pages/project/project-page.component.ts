import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';

import { ProjectsService } from './../../projects/services/projects.service';
import { LocalesService } from './../../locales/services/locales.service';

@Component({
    providers: [ProjectsService, LocalesService],
    selector: 'project-page',
    templateUrl: 'project-page.component.html'
})
export class ProjectPage implements OnInit {
    private project;
    private locales;
    private loadingProject = false;
    private loadingLocales = false;

    constructor(
        private route: ActivatedRoute,
        private projectsService: ProjectsService,
        private localesService: LocalesService
    ) { }

    ngOnInit() {
        this.route.params
            .map(params => params['projectId'])
            .subscribe(projectId => {
                this.fetchProject(projectId);
                this.fetchLocales(projectId);
            });

        this.localesService.locales
            .subscribe(locales => this.locales = locales);
    }

    fetchProject(projectId) {
        this.loadingProject = true;
        this.projectsService.fetchProject(projectId)
            .subscribe(
            project => this.project = project,
            err => console.log(err),
            () => this.loadingProject = false,
        );
    }

    fetchLocales(projectId) {
        this.loadingLocales = true;
        this.localesService.fetchLocales(projectId)
            .subscribe(
            locales => this.locales = locales,
            err => console.log(err),
            () => this.loadingLocales = false,
        );
    }
}