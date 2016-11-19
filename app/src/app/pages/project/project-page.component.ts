import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProjectsService } from './../../projects';

@Component({
    selector: 'project-page',
    templateUrl: 'project-page.component.html'
})
export class ProjectPageComponent implements OnInit {
    private project;

    constructor(private projectsService: ProjectsService, private route: ActivatedRoute) {
        this.fetchProject = this.fetchProject.bind(this);
    }

    ngOnInit() {
        let id = +this.route.snapshot.params['projectId'];
        this.fetchProject(id);
    }

    fetchProject(id: number) {
        this.projectsService.getProject(id).subscribe(
            res => { this.project = res },
            err => { }
        );
    }
}