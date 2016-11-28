import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { LocalesService } from './../locales/services/locales.service';

@Injectable()
export class LocaleResolver implements Resolve<any> {

    constructor(private localesService: LocalesService) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        return this.localesService.fetchLocale(route.params['projectId'], route.params['localeIdent']);
    }
}