import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';

import { ProjectsService } from './../../projects/services/projects.service';
import { Project } from './../model/project';
import { ActivatedRoute } from '@angular/router';
import { ProjectMenuService } from './../../core/services/project-menu.service';

@Component({
    providers: [ProjectsService],
    selector: 'parrot-project-wrapper',
    templateUrl: 'project-wrapper.component.html',
    styleUrls: ['project-wrapper.component.css']
})
export class ProjectWrapperComponent implements OnInit {
    private loading: boolean;
    private project: Project;
    private menuActive: boolean;

    constructor(private projectsService: ProjectsService, private route: ActivatedRoute, private projectMenuService: ProjectMenuService) { }

    ngOnInit() {
        this.route.params
            .map(params => params['projectId'])
            .subscribe(projectId => this.fetchProject(projectId));

        this.projectsService.activeProject
            .subscribe(project => this.project = project);

        this.projectMenuService.menuActive
            .subscribe(active => this.menuActive = active);
    }

    closeMenu() {
        this.projectMenuService.setInactive();
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