import { Component } from '@angular/core';

import { ProjectsService } from './../services/projects.service';

@Component({
    selector: 'project-keys',
    templateUrl: 'project-keys.component.html'
})
export class ProjectKeysComponent {
    constructor(private projectsService: ProjectsService) { }
}