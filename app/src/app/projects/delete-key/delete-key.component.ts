import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'parrot-delete-key',
    templateUrl: 'delete-key.component.html'
})
export class DeleteKeyComponent implements OnInit {
    @Input()
    private pending: boolean = false;
    @Input()
    private key: string;
    @Input()
    private submit;

    private repeatKey: string;
    private modalOpen: boolean;

    constructor() { }

    ngOnInit() { }

    confirm() {
        this.submit(this.repeatKey);
    }

    openModal() {
        this.modalOpen = true;
    }

    closeModal() {
        this.modalOpen = false;
        this.reset();
    }

    valid(): boolean {
        if (!this.repeatKey) {
            return false;
        }
        if (this.repeatKey.length <= 0) {
            return false;
        }
        return this.repeatKey === this.key;
    }

    reset() {
        this.repeatKey = '';
    }
}