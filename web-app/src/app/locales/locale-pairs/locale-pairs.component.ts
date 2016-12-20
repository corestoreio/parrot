import { Component, OnInit, Input } from '@angular/core';

import { Locale } from './../model/locale';
import { LocalesService } from './../services/locales.service';


@Component({
    selector: 'locale-pairs',
    templateUrl: './locale-pairs.component.html',
    styleUrls: ['locale-pairs.component.css']
})
export class LocalePairsComponent {
    @Input()
    private loading: boolean = false;
    @Input()
    private editable: boolean = false;
    @Input()
    private locale: Locale;

    private updatePending: boolean = false;

    constructor(private localesService: LocalesService) {
        this.commitPair = this.commitPair.bind(this);
    }

    ngOnInit() { }

    commitPair(pair) {
        this.updatePending = true;
        // TODO: make this nice.
        this.locale.pairs[pair.key] = pair.value;
        this.localesService.updateLocalePairs(this.locale.project_id, this.locale.ident, this.locale.pairs)
            .subscribe(
            locale => { this.locale = locale; },
            err => console.log(err),
            () => { this.updatePending = false }
            );
    }
}
