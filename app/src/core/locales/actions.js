import fetch from 'isomorphic-fetch'
import Remotes from './../util/remotes'
import { extractJson } from './../util/fetch'
import { getToken } from './../util/token'

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

    fetchLocales: (project) => {
        return (dispatch) => {
            dispatch({type: localeActions.FETCH_PROJECTS_PENDING})
            return fetch(Remotes.localesPath(project.id), {
                method: 'GET',
                headers: {
                    "Accept": 'application/json',
                    "Authorization": getToken()
                }
            })
                .then(res => extractJson(res))
                .then(json => {
                    return dispatch({type: localeActions.FETCH_LOCALES_FULFILLED, payload: json})
                })
                .catch(err => {
                    return dispatch({type: localeActions.FETCH_LOCALES_REJECTED, payload: err})
                });
        };
    },

    fetchLocale: (project, locale) => {
        return (dispatch) => {
            dispatch({type: localeActions.FETCH_LOCALE_PENDING})
            return fetch(Remotes.localePath(project.id, locale.ident), {
                method: 'GET',
                headers: {
                    "Accept": 'application/json',
                    "Authorization": getToken()
                }
            })
                .then(res => extractJson(res))
                .then(json => {
                    return dispatch({type: localeActions.FETCH_LOCALE_FULFILLED, payload: json})
                })
                .catch(err => {
                    return dispatch({type: localeActions.FETCH_LOCALE_REJECTED, payload: err})
                });
        };
    },

    createLocale: (projectId, locale) => {
        return (dispatch) => {
            dispatch({type: localeActions.CREATE_LOCALE_PENDING})
            const data = {
                locale: locale.ident
            }
            return fetch(Remotes.localesPath(projectId), {
                method: 'POST',
                headers: {
                    "Accept": 'application/json',
                    "Authorization": getToken()
                },
                body: JSON.stringify(data)
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('request failed');
                    }
                    return extractJson(res);
                })
                .then(json => {
                    return dispatch({type: localeActions.CREATE_LOCALE_FULFILLED, payload: json})
                })
                .catch(err => {
                    return dispatch({type: localeActions.CREATE_LOCALE_REJECTED, payload: err})
                });
        };
    }
};
