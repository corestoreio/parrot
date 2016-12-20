import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Project, UpdateProjectNamePayload } from './../model/project';
import { ProjectsService } from './../services/projects.service';
import { ErrorsService } from './../../shared/errors.service';

@Component({
    selector: 'edit-project-name',
    templateUrl: 'edit-project-name.component.html',
    styleUrls: ['edit-project-name.component.css']
})
export class EditProjectNameComponent implements OnInit {

    @Input()
    private project: Project;

    private newName: string;

    private loading: boolean = false;
    private modalOpen: boolean = false;
    private errors: string[];

    constructor(
        private route: ActivatedRoute,
        private service: ProjectsService,
        private errorsService: ErrorsService,
    ) { }

    ngOnInit() {
        this.reset();
    }

    reset() {
        this.loading = false;
        this.errors = [];
        this.newName = this.project.name;
    }

    formValid(): boolean {
        if (!this.newName || this.newName.length <= 0) {
            return false;
        }
        return true;
    }

    saveChanges() {
        if (!this.project) {
            console.error("no project set");
            return;
        }
        this.loading = true;
        this.service.updateProjectName(this.project.id, this.newName)
            .subscribe(
            project => { this.project = project; this.loading = false },
            err => {
                this.errors = this.errorsService.mapErrors(err, 'UpdateProjectName');
                this.loading = false;
            },
        );
    }
}