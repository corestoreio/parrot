import { Component, Input } from '@angular/core';

@Component({
    selector: 'create-locale',
    templateUrl: 'create-locale.component.html'
})
export class CreateLocaleComponent {
    @Input()
    onSubmit
}