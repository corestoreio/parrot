import { Component, OnInit, Input } from '@angular/core';

import { Locale, Pair } from './../model/locale';
import { LocalesService } from './../services/locales.service';

@Component({
    selector: 'locale-pairs',
    templateUrl: './locale-pairs.component.html',
    styleUrls: ['locale-pairs.component.css']
})
export class LocalePairsComponent {
    @Input()
    set locale(value: Locale) {
        this._locale = value;
        this.pairs = this.transformPairs(value);
    }

    get locale(): Locale {
        return this._locale;
    }

    private _locale: Locale;

    @Input()
    private loading: boolean = false;
    @Input()
    private editable: boolean = false;

    public pairs: Pair[];
    private updatePending: boolean = false;

    constructor(private localesService: LocalesService) {
        this.commitPair = this.commitPair.bind(this);
    }

    ngOnInit() { }

    commitPair(pair: Pair) {
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

    transformPairs(locale: Locale): Array<Pair> {
        if (!locale) {
            return [];
        }
        let pairs = locale.pairs;
        let result: Array<Pair> = [];
        let keys = Object.keys(pairs);
        for (let i = 0; i < keys.length; i++) {
            let pair = {
                key: keys[i],
                value: pairs[keys[i]]
            };
            result.push(pair);
        }
        return result;
    }
}
