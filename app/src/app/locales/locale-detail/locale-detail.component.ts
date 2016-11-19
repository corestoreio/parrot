import { Component, Input } from '@angular/core';

@Component({
    selector: 'locale-detail',
    templateUrl: './locale-detail.component.html'
})
export class LocaleDetailComponent {
    @Input()
    locale;
}
