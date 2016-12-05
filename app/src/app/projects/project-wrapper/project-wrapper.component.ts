import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';

import { ProjectsService } from './../../projects/services/projects.service';
import { Project } from './../model/project';
import { ActivatedRoute } from '@angular/router';

@Component({
    providers: [ProjectsService],
    selector: 'parrot-project-wrapper',
    templateUrl: 'project-wrapper.component.html'
})
export class ProjectWrapperComponent implements OnInit {
    private loading: boolean;
    private project: Project;

    constructor(private projectsService: ProjectsService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.params
            .map(params => params['projectId'])
            .subscribe(projectId => this.fetchProject(projectId));

        this.projectsService.activeProject
            .subscribe(project => this.project = project);
    }

    fetchProject(projectId) {
        this.loading = true;
        this.projectsService.fetchProject(projectId)
            .subscribe(
            () => { },
            err => console.log(err),
            () => this.loading = false,
        );
    }
}