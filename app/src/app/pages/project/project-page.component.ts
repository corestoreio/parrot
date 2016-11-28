import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

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
    private projectPending = false;
    private localesPending = false;

    private get loading() {
        return this.projectPending || this.localesPending;
    }

    constructor(private router: ActivatedRoute, private projectsService: ProjectsService, private localesService: LocalesService) { }

    ngOnInit() {
        this.router.params.subscribe(
            params => {
                this.fetchProject(params['projectId']);
                this.fetchLocales(params['projectId']);
            }
        );
    }

    fetchProject(projectId) {
        this.projectPending = true;
        this.projectsService.fetchProject(projectId)
            .subscribe(
            project => {
                this.project = project;
            },
            err => {
                console.log(err);
            },
            () => {
                this.projectPending = false;
            });
    }

    fetchLocales(projectId) {
        this.localesPending = true;
        this.localesService.fetchLocales(projectId)
            .subscribe(
            locales => {
                this.locales = locales;
            },
            err => {
                console.log(err);
            },
            () => {
                this.localesPending = false;
            });
    }
}