import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'delete-app',
    templateUrl: 'delete-app.component.html'
})
export class DeleteAppComponent implements OnInit {
    @Input()
    public pending: boolean = false;
    @Input()
    public clientName: string;
    @Input()
    private submit;

    public repeatName: string;
    public modalOpen: boolean;

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
        if (!this.repeatName) {
            return false;
        }
        if (this.repeatName.length <= 0) {
            return false;
        }
        return this.repeatName === this.clientName;
    }

    reset() {
        this.repeatName = '';
    }
}
