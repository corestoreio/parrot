import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/switchMapTo';

import { UserService } from './../../users/services/user.service';
import { LocalesService } from './../../locales/services/locales.service';
import { Locale } from './../../locales/model/locale';

@Component({
    providers: [LocalesService],
    selector: 'locale-page',
    templateUrl: 'locale-page.component.html',
    styleUrls: ['locale-page.component.css']
})
export class LocalePage implements OnInit {
    private set locale(value: Locale) {
        this._locale = value;
        this.percentTranslated = this.calcPercentTranslated(value);
    }

    private get locale(): Locale {
        return this._locale;
    }

    private _locale: Locale;
    private percentTranslated: number;
    private projectId: string;
    public loading = false;
    private canEditLocales = false;
    private canExportLocales = false;
    private canDeleteLocales = false;

    constructor(
        private route: ActivatedRoute,
        private localesService: LocalesService,
        private userService: UserService,
    ) {
    }

    ngOnInit() {
        this.route.parent.params
            .map(params => params['projectId'])
            .map(projectId => { this.projectId = projectId; })
            .switchMapTo(this.route.params)
            .map(params => params['localeIdent'])
            .subscribe(localeIdent => {
                this.fetchLocale(this.projectId, localeIdent);
                this.userService.isAuthorized(this.projectId, 'CanUpdateLocales')
                    .subscribe(ok => { this.canEditLocales = ok });
                this.userService.isAuthorized(this.projectId, 'CanExportLocales')
                    .subscribe(ok => { this.canExportLocales = ok });
                this.userService.isAuthorized(this.projectId, 'CanDeleteLocales')
                    .subscribe(ok => { this.canDeleteLocales = ok });
            });

        this.localesService.activeLocale
            .subscribe(locale => this.locale = locale);
    }

    fetchLocale(projectId, localeIdent) {
        this.loading = true;
        this.localesService.fetchLocale(projectId, localeIdent)
            .subscribe(
            locale => { },
            err => console.log(err),
            () => this.loading = false,
        );
    }

    calcPercentTranslated(locale: Locale): number {
        let percent = 0;
        if (locale) {
            let filled = 0;
            let pairs = locale.pairs;
            let keys = Object.keys(pairs);
            if (keys.length <= 0) {
                return 0;
            }
            keys.forEach(key => {
                let v = pairs[key];
                if (v && v.length > 0) {
                    filled++;
                }
            });
            percent = Math.round((filled / keys.length) * 100);
        }
        return percent;
    }
}
