import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LocalesService } from './../services/locales.service';

@Component({
    selector: 'locales-list',
    templateUrl: './locales-list.component.html'
})
export class LocalesListComponent {
    @Input()
    locales;
}