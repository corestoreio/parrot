import { Component, OnInit, Input } from '@angular/core';

import { ProjectUser } from './../model';
import { ProjectUsersService } from './../services/project-users.service';

@Component({
    selector: 'add-project-user',
    templateUrl: 'add-project-user.component.html',
    styleUrls: ['add-project-user.component.css']
})
export class AddProjectUserComponent implements OnInit {
    @Input()
    private projectId: string;

    get roles(): string[] {
        return ['owner', 'editor', 'viewer'];
    }

    private email: string;
    private selectedRole: string = '';
    private modalOpen: boolean;
    private errors: string[];
    private loading: boolean;

    constructor(private service: ProjectUsersService) { }

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
    }

    valid(): boolean {
        return false;
    }

    submit() {
        this.loading = true;
        let user: ProjectUser = { email: this.email, project_id: this.projectId, role: this.selectedRole }
        this.service.createProjectUser(user)
            .subscribe(
            res => console.log(res),
            err => this.errors = err,
            () => this.loading = false,
        )
    }
}