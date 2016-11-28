import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
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
    private loading = false;

    constructor(private router: Router, private route: ActivatedRoute, private projectsService: ProjectsService, private localesService: LocalesService) { }

    ngOnInit() {
        this.loading = true;
        this.route.data.subscribe(data => {
            this.project = data['project'];
            this.locales = data['locales'];
            this.loading = false;
        });
        this.router.events.subscribe(v => {
            if (v instanceof NavigationStart) {
                this.loading = true;
            }
        })
    }
}