import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import { APIService } from './../../shared/api.service';
import { Locale, LocaleInfo } from './../model';
import { LocalesList } from './../../app.config';

@Injectable()
export class LocalesService {

    private _locales = new BehaviorSubject<Locale[]>([]);
    public locales: Observable<Locale[]> = this._locales.asObservable();

    public get localeInfoList(): LocaleInfo[] {
        return LocalesList;
    }

    constructor(private api: APIService) { }

    createLocale(projectId: number, locale: Locale): Observable<Locale> {
        let request = this.api.request({
            uri: `/projects/${projectId}/locales`,
            method: 'POST',
            body: JSON.stringify(locale),
        })
            .map(res => {
                let locale = res.payload;
                if (!locale) {
                    throw new Error("no locale in response");
                }
                return locale;
            }
            ).share();

        request.subscribe(locale => {
            this._locales.next(this._locales.getValue().concat(locale));
        }, () => { });

        return request;
    }

    updateLocalePairs(projectId: string, localeIdent: string, pairs): Observable<Locale> {
        return this.api.request({
            uri: `/projects/${projectId}/locales/${localeIdent}/pairs`,
            method: 'PATCH',
            body: JSON.stringify(pairs),
        })
            .map(res => {
                let payload = res.payload;
                if (!payload) {
                    throw new Error("no payload in response");
                }
                return payload;
            }).share();
    }

    fetchLocales(projectId: string): Observable<Locale[]> {
        let request = this.api.request({
            uri: `/projects/${projectId}/locales/`,
            method: 'GET',
        })
            .map(res => {
                let locales = res.payload;
                if (!locales) {
                    throw new Error("no locales in response");
                }
                return locales;
            }).share();

        request.subscribe(locales => {
            this._locales.next(locales);
        }, () => { });

        return request;
    }

    fetchLocale(projectId: string, localeIdent: string): Observable<Locale> {
        let request = this.api.request({
            uri: `/projects/${projectId}/locales/${localeIdent}`,
            method: 'GET',
        })
            .map(res => {
                let locale = res.payload;
                if (!locale) {
                    throw new Error("no locale in response");
                }
                return locale;
            }).share();

        return request;
    }
}
