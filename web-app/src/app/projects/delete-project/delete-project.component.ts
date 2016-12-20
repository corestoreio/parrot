import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Project } from './../model/project';
import { ProjectsService } from './../services/projects.service';
import { ErrorsService } from './../../shared/errors.service';

@Component({
    selector: 'delete-project',
    templateUrl: 'delete-project.component.html'
})
export class DeleteProjectComponent implements OnInit {
    @Input()
    private pending: boolean = false;
    @Input()
    private project: Project;
    @Input()
    private submit;

    private repeatName: string;
    private modalOpen: boolean;
    private loading: boolean;
    private errors: string[];

    constructor(
        private service: ProjectsService,
        private errorsService: ErrorsService,
        private router: Router,
    ) { }


    ngOnInit() { }

    confirm() {
        if (!this.project) {
            console.error("no project set");
            return;
        }
        this.loading = true;
        this.service.deleteProject(this.project.id)
            .subscribe(
            () => { this.loading = false; this.router.navigate(['/']) },
            err => {
                this.errors = this.errorsService.mapErrors(err, 'DeleteProject');
                this.loading = false;
            },
        );
    }

    openModal() {
        this.modalOpen = true;
    }

    closeModal() {
        this.modalOpen = false;
        this.reset();
    }

    valid(): boolean {
        if (!this.repeatName) {
            return false;
        }
        if (this.repeatName.length <= 0) {
            return false;
        }
        return this.repeatName === this.project.name;
    }

    reset() {
        this.repeatName = '';
    }
}