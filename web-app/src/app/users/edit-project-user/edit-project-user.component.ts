import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProjectUser } from './../model';
import { ProjectUsersService } from './../services/project-users.service';

@Component({
    selector: 'edit-project-user',
    templateUrl: 'edit-project-user.component.html',
    styleUrls: ['edit-project-user.component.css']
})
export class EditProjectUserComponent implements OnInit {
    @Input()
    private user: ProjectUser;

    get roles(): string[] {
        return this.service.availableRoles;
    }

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
        this.selectedRole = '';
        this.loading = false;
        this.errors = [];
    }

    commitChanges() {
        this.loading = true;
        this.service.updateProjectUser(Object.assign(this.user, { role: this.selectedRole }))
            .subscribe(
            res => this.closeModal(),
            err => { this.errors = err; this.loading = false },
        )
    }

    revokeUser() {
        var c = confirm(`Revoke all rights for user: ${this.user.email}?`);
        if (!c) {
            return;
        }
        this.loading = true;
        this.service.revokeProjectUser(this.user)
            .subscribe(
            res => this.closeModal(),
            err => { this.errors = err; this.loading = false },
        )
    }
}