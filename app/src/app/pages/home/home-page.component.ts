import { Component, OnInit } from '@angular/core';

import { ProjectsService } from './../../projects';

@Component({
    selector: 'home-page',
    templateUrl: 'home-page.component.html'
})
export class HomePageComponent implements OnInit {
    projects;

    constructor(private projectsService: ProjectsService) {
        this.projects = [];
        this.createProject = this.createProject.bind(this);
    }

    ngOnInit() {
        this.projectsService.getProjects().subscribe(
            res => { this.projects = res; },
            err => { console.log(err); }
        )
    }

    createProject(project) {
        this.projectsService.createProject(project).subscribe(
            res => { },
            err => { console.log(err); }
        );
    }
}