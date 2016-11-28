import { Component, Input } from '@angular/core';

@Component({
    selector: 'locales-list',
    templateUrl: './locales-list.component.html'
})
export class LocalesListComponent {
    @Input()
    locales;
}