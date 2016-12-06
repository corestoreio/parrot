import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProjectUser } from './../model';
import { ProjectUsersService } from './../services/project-users.service';

@Component({
    selector: 'add-project-user',
    templateUrl: 'add-project-user.component.html',
    styleUrls: ['add-project-user.component.css']
})
export class AddProjectUserComponent implements OnInit {
    get roles(): string[] {
        return ['owner', 'editor', 'viewer'];
    }

    private email: string = '';
    private selectedRole: string = '';
    private modalOpen: boolean = false;
    private loading: boolean = false;
    private errors: string[];

    constructor(
        private route: ActivatedRoute,
        private service: ProjectUsersService,
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
    }

    valid(): boolean {
        return false;
    }

    submit() {
        this.loading = true;
        let projectId = this.route.snapshot.params['projectId'];
        let user: ProjectUser = { email: this.email, project_id: projectId, role: this.selectedRole };
        this.service.createProjectUser(user)
            .subscribe(
            res => console.log(res),
            err => this.errors = err,
            () => this.loading = false,
        )
    }
}