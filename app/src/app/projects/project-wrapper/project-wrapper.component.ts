import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';

import { ProjectsService } from './../../projects/services/projects.service';
import { Project } from './../model/project';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'parrot-project-wrapper',
    templateUrl: 'project-wrapper.component.html'
})
export class ProjectWrapperComponent implements OnInit {
    private loadingProject: boolean;
    private project: Project;

    constructor(private projectsService: ProjectsService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.params
            .map(params => params['projectId'])
            .subscribe(projectId => this.fetchProject(projectId));
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
}