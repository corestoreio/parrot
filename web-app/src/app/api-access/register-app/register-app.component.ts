import { Component, OnInit, Input } from '@angular/core';

import { APIAccessService } from './../services/api-access.service';

@Component({
    selector: 'register-app',
    templateUrl: './register-app.component.html',
    styleUrls: ['./register-app.component.css']
})
export class RegisterAppComponent implements OnInit {
    @Input()
    private projectId: string;

    public clientName: string;
    public modalOpen: boolean;
    public loading: boolean;

    constructor(private service: APIAccessService) { }

    ngOnInit() { }

    openModal() {
        this.modalOpen = true;
    }

    closeModal() {
        this.modalOpen = false;
        this.reset();
    }

    reset() {
        this.clientName = '';
        this.loading = false;
    }

    registerApp() {
        this.loading = true;
        this.service.registerProjectClient(this.projectId, this.clientName)
            .subscribe(
            () => this.closeModal(),
            err => {
                console.log(err);
                this.loading = false;
            },
        );
    }
}
