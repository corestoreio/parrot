import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LocalesService } from './../../locales';
import { ProjectsService } from './../../projects';

@Component({
    selector: 'project-page',
    templateUrl: 'project-page.component.html'
})
export class ProjectPageComponent implements OnInit {
    private project;
    private locales;

    constructor(
        private projectsService: ProjectsService,
        private localesService: LocalesService,
        private route: ActivatedRoute
    ) {
        this.getProject = this.getProject.bind(this);
        this.getLocales = this.getLocales.bind(this);
        this.onCreateLocale = this.onCreateLocale.bind(this);
    }

    ngOnInit() {
        let projectId = +this.route.snapshot.params['projectId'];
        this.getProject(projectId);
        this.getLocales(projectId);
    }

    getProject(projectId: number) {
        this.projectsService.getProject(projectId).subscribe(
            res => { this.project = res },
            err => { console.log(err); }
        );
    }

    getLocales(projectId: number) {
        this.localesService.getLocales(projectId).subscribe(
            res => { this.locales = res; },
            err => { console.log(err); },
            () => { }
        )
    }

    onCreateLocale(locale) {
        let projectId = +this.route.snapshot.params['projectId'];
        this.localesService.createLocale(projectId, locale).subscribe(
            res => { },
            err => { console.log(err); }
        )
    }
}