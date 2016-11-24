import { Component, OnInit } from '@angular/core';

import { LocalesService } from './../../locales/services/locales.service';

@Component({
    providers: [LocalesService],
    selector: 'locale-page',
    templateUrl: 'locale-page.component.html'
})
export class LocalePage implements OnInit {
    ngOnInit() {

    }
}