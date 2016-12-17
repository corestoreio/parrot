import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User, UpdateUserNamePayload } from './../model';
import { UserService } from './../services/user.service';
import { ErrorsService } from './../../shared/errors.service';

@Component({
    selector: 'edit-user-name',
    templateUrl: 'edit-user-name.component.html',
    styleUrls: ['edit-user-name.component.css']
})
export class EditUserNameComponent implements OnInit {

    @Input()
    private user: User;

    private formData: UpdateUserNamePayload;

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
            name: this.user.name,
        };
    }

    formValid(): boolean {
        let formData = this.formData;
        if (!formData.name) {
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
        this.service.updateName(this.formData)
            .subscribe(
            user => { this.user = user; this.loading = false },
            err => {
                this.errors = this.errorsService.mapErrors(err, 'Register');
                this.loading = false;
            },
        );
    }
}