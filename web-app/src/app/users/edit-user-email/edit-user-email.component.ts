import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User, UpdateUserEmailPayload } from './../model';
import { UserService } from './../services/user.service';
import { ErrorsService } from './../../shared/errors.service';

@Component({
    selector: 'edit-user-email',
    templateUrl: 'edit-user-email.component.html',
    styleUrls: ['edit-user-email.component.css']
})
export class EditUserEmailComponent implements OnInit {

    @Input()
    private user: User;

    private formData: UpdateUserEmailPayload;

    private loading: boolean = false;
    private modalOpen: boolean = false;
    private errors: string[];

    constructor(
        private route: ActivatedRoute,
        private service: UserService,
        private errorsService: ErrorsService,
    ) { }

    ngOnInit() {
        this.reset();
    }

    reset() {
        this.loading = false;
        this.errors = [];
        this.formData = {
            userId: this.user.id,
            email: this.user.email,
        };
    }

    formValid(): boolean {
        let formData = this.formData;
        if (!formData.email) {
            return false;
        }
        return true;
    }

    saveChanges() {
        if (!this.user) {
            console.error("no user set");
            return;
        }
        this.formData.userId = this.user.id;
        this.loading = true;
        this.service.updateEmail(this.formData)
            .subscribe(
            user => { this.user = user; this.loading = false },
            err => {
                this.errors = this.errorsService.mapErrors(err, 'Register');
                this.loading = false;
            },
        );
    }
}