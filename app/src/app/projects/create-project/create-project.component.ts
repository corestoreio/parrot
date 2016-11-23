import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { ProjectsService } from './../services/projects.service';

@Component({
    selector: 'create-project',
    templateUrl: './create-project.component.html'
})
export class CreateProjectComponent {
    private modalOpen = false;
    private loading = false;
    private project;

    constructor(private projectsService: ProjectsService) {
        this.resetProject();
        this.createProject = this.createProject.bind(this);
    }

    openModal() {
        this.modalOpen = true;
    }

    closeModal() {
        this.modalOpen = false;
        this.resetProject();
    }

    resetProject() {
        this.project = {
            name: ''
        };
    }

    createProject() {
        this.loading = true;
        this.projectsService.createProject(this.project).subscribe(
            res => { },
            err => { console.log(err); },
            () => {
                this.loading = false;
                this.closeModal();
            }
        );
    }
}
