import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'delete-app',
    templateUrl: 'delete-app.component.html'
})
export class DeleteAppComponent implements OnInit {
    @Input()
    private pending: boolean = false;
    @Input()
    private appName: string;
    @Input()
    private submit;

    private repeatAppName: string;
    private modalOpen: boolean;

    constructor() { }

    ngOnInit() { }

    confirm() {
        this.submit();
    }

    openModal() {
        this.modalOpen = true;
    }

    closeModal() {
        this.modalOpen = false;
        this.reset();
    }

    valid(): boolean {
        if (!this.repeatAppName) {
            return false;
        }
        if (this.repeatAppName.length <= 0) {
            return false;
        }
        return this.repeatAppName === this.appName;
    }

    reset() {
        this.repeatAppName = '';
    }
}