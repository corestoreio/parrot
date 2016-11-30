import { Component, Input } from '@angular/core';

import { Locale } from './../model/locale';

@Component({
    selector: 'locales-list',
    templateUrl: './locales-list.component.html',
    styleUrls: ['locales-list.component.css']
})
export class LocalesListComponent {
    @Input()
    private locales: Locale;
    @Input()
    private loading: boolean;
}