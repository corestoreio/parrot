import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';

import { UserService } from './../../users/services/user.service';
import { ProjectsService } from './../services/projects.service';
import { Project } from './../model/project';
import { ActivatedRoute } from '@angular/router';

@Component({
    providers: [ProjectsService, UserService],
    selector: 'parrot-project-wrapper',
    templateUrl: 'project-wrapper.component.html',
    styleUrls: ['project-wrapper.component.css']
})
export class ProjectWrapperComponent implements OnInit {
    private loading: boolean;
    public project: Project;
    private menuActive: boolean;

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
