import { Component, OnInit, Input } from '@angular/core';

import { RestoreItemService } from './../../shared/restore-item.service';
import { Locale } from './../model/locale';
import { LocalesService } from './../services/locales.service';

export interface Pair {
    key: string;
    value: string;
}

@Component({
    providers: [],
    selector: 'editable-textfield',
    templateUrl: './editable-textfield.component.html',
    styleUrls: ['editable-textfield.component.css']
})
export class EditableTextFieldComponent {

    @Input()
    set pair(value: Pair) {
        if (!value) {
            return;
        }
        // TODO: !!!!!!
        this._original = value;
        this._pair = JSON.parse(JSON.stringify(value));
    }

    @Input()
    private loading: boolean = false;
    @Input()
    private commit;

    private _pair: Pair;
    private _original: Pair;
    private editing: boolean = false;

    constructor(
        private restoreService: RestoreItemService<string>,
    ) {
    }

    ngOnInit() { }

    enableEdit() {
        this.editing = true;
    }

    cancelEdit() {
        this.editing = false;
        this._pair = JSON.parse(JSON.stringify(this._original));;
    }

    commitChanges() {
        this.commit(this._pair);
    }
}
