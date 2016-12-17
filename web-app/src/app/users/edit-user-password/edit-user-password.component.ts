import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User, UpdateUserPasswordPayload } from './../model';
import { UserService } from './../services/user.service';
import { ErrorsService } from './../../shared/errors.service';

@Component({
    selector: 'edit-user-password',
    templateUrl: 'edit-user-password.component.html',
    styleUrls: ['edit-user-password.component.css']
})
export class EditUserPasswordComponent implements OnInit {

    @Input()
    private user: User;

    private formData: UpdateUserPasswordPayload;

    private modalOpen: boolean = false;
    private loading: boolean = false;
    private errors: string[];

    constructor(
        private route: ActivatedRoute,
        private service: UserService,
        private errorsService: ErrorsService,
    ) { }

    ngOnInit() {
        this.reset();
    }

    openModal() {
        this.modalOpen = true;
    }

    closeModal() {
        this.modalOpen = false;
        this.reset();
    }

    reset() {
        this.loading = false;
        this.errors = [];
        this.formData = {
            userId: this.user.id,
            oldPassword: '',
            newPassword: '',
            repeatNewPassword: '',
        };
    }

    formValid(): boolean {
        let formData = this.formData;
        if (!formData.oldPassword || !formData.newPassword || !formData.repeatNewPassword) {
            return false;
        }
        if (formData.newPassword !== formData.repeatNewPassword) {
            return false;
        }
        return true;
    }

    commitChanges() {
        if (!this.user) {
            console.error("no user set");
            return;
        }
        this.formData.userId = this.user.id;
        this.loading = true;
        this.service.updatePassword(this.formData)
            .subscribe(
            () => this.closeModal(),
            err => {
                this.errors = this.errorsService.mapErrors(err, 'Register');
                this.loading = false;
            },
        );
    }
}