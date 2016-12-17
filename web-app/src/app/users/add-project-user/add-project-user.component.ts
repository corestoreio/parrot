import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProjectUser } from './../model';
import { ProjectUsersService } from './../services/project-users.service';
import { ErrorsService } from './../../shared/errors.service';

@Component({
    selector: 'add-project-user',
    templateUrl: 'add-project-user.component.html',
    styleUrls: ['add-project-user.component.css']
})
export class AddProjectUserComponent implements OnInit {

    get roles(): string[] {
        return this.service.availableRoles;
    }

    private email: string = '';
    private selectedRole: string = '';
    private modalOpen: boolean = false;
    private loading: boolean = false;
    private errors: string[];

    constructor(
        private route: ActivatedRoute,
        private service: ProjectUsersService,
        private errorsService: ErrorsService,
    ) { }

    ngOnInit() { }

    openModal() {
        this.modalOpen = true;
    }

    closeModal() {
        this.modalOpen = false;
        this.reset();
    }

    reset() {
        this.email = '';
        this.selectedRole = '';
        this.loading = false;
        this.errors = [];
    }

    submit() {
        this.loading = true;
        let projectId = this.route.parent.snapshot.params['projectId'];
        let user: ProjectUser = { email: this.email, project_id: projectId, role: this.selectedRole };
        this.service.createProjectUser(user)
            .subscribe(
            res => this.closeModal(),
            err => {
                this.errors = this.errorsService.mapErrors(err, 'AddProjectUser');
                this.loading = false;
            },
        )
    }
}