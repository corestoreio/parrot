import Remotes from './../util/remotes';
import { apiRequest } from './../util/api';

export const localeActions = {
    CREATE_LOCALE: 'CREATE_LOCALE',
    CREATE_LOCALE_PENDING: 'CREATE_LOCALE_PENDING',
    CREATE_LOCALE_REJECTED: 'CREATE_LOCALE_REJECTED',
    CREATE_LOCALE_FULFILLED: 'CREATE_LOCALE_FULFILLED',

    FETCH_LOCALE: 'FETCH_LOCALE',
    FETCH_LOCALE_PENDING: 'FETCH_LOCALE_PENDING',
    FETCH_LOCALE_REJECTED: 'FETCH_LOCALE_REJECTED',
    FETCH_LOCALE_FULFILLED: 'FETCH_LOCALE_FULFILLED',
    
    FETCH_LOCALES: 'FETCH_LOCALES',
    FETCH_LOCALES_PENDING: 'FETCH_LOCALES_PENDING',
    FETCH_LOCALES_REJECTED: 'FETCH_LOCALES_REJECTED',
    FETCH_LOCALES_FULFILLED: 'FETCH_LOCALES_FULFILLED',

    UPDATE_LOCALE: 'UPDATE_LOCALE',
    UPDATE_LOCALE_PENDING: 'UPDATE_LOCALE_PENDING',
    UPDATE_LOCALE_REJECTED: 'UPDATE_LOCALE_REJECTED',
    UPDATE_LOCALE_FULFILLED: 'UPDATE_LOCALE_FULFILLED'
}

export function fetchLocales(projectId) {
    return {
        type: localeActions.FETCH_LOCALES,
        payload: apiRequest({
            method: 'GET',
            path: Remotes.localesPath(projectId),
            includeAuth: true
        })
    };
}

export function updateLocale(projectId, locale) {
    return {
        type: localeActions.UPDATE_LOCALE,
        payload: apiRequest({
            method: 'PUT',
            path: Remotes.localePath(projectId, locale.id),
            body: JSON.stringify(locale),
            includeAuth: true
        })
    };
}

export function createLocale(projectId, locale) {
    return {
        type: localeActions.CREATE_LOCALE,
        payload: apiRequest({
            method: 'POST',
            path: Remotes.localesPath(projectId),
            body:  JSON.stringify(locale),
            includeAuth: true
        })
    };
}
