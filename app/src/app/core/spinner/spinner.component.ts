import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { SpinnerService, SpinnerState } from './spinner.service';

@Component({
    selector: 'parrot-spinner',
    templateUrl: 'spinner.component.html'
})
export class SpinnerComponent implements OnInit {
    visible = false;

    private spinnerStateSubscription: Subscription;

    constructor(private spinnerService: SpinnerService) { }

    ngOnInit() {
        this.spinnerStateSubscription = this.spinnerService.spinnerState
            .subscribe((state: SpinnerState) => {
                this.visible = state.show;
            });
    }

    ngOnDestroy() {
        this.spinnerStateSubscription.unsubscribe();
    }
}