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
    private loading = false;

    constructor(private router: ActivatedRoute, private projectsService: ProjectsService) { }

    ngOnInit() {
        this.router.params
            .map(params => params['projectId'])
            .switchMap(projectId => {
                this.loading = true;
                return this.projectsService.getProject(projectId);
            })
            .subscribe(project => {
                this.project = project; this.loading = false;
            }, err => {
                console.log(err); this.loading = false;
            });
    }
}