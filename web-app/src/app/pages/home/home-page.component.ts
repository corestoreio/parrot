import { Component, OnInit } from '@angular/core';

import { ProjectsService } from './../../projects/services/projects.service';

@Component({
    selector: 'home-page',
    templateUrl: 'home-page.component.html',
    styleUrls: ['home-page.component.css'],
    providers: [ProjectsService]
})
export class HomePage implements OnInit {
    private projects;
    public loading = false;

    constructor(private projectsService: ProjectsService) { }

    ngOnInit() {
        this.projectsService.projects
            .subscribe(projects => this.projects = projects);
        this.fetchProjects();
    }

    fetchProjects() {
        this.loading = true;
        this.projectsService.fetchProjects()
            .subscribe(
            () => { },
            err => console.log(err),
            () => this.loading = false
            );
    }
}
