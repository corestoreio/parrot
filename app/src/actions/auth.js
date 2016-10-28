import fetch from 'isomorphic-fetch'
import Paths from './../paths'
import { extractJson } from './../helpers/fetch'
import { storeToken } from './../helpers/token'

export const AUTH = 'AUTH'
export const AUTH_PENDING = 'AUTH_PENDING'
export const AUTH_REJECTED = 'AUTH_REJECTED'
export const AUTH_FULFILLED = 'AUTH_FULFILLED'

export function authenticate(credentials) {
    return (dispatch) => {
        dispatch({type: AUTH_PENDING})
        return fetch(Paths.apiRoot + Paths.authenticate, {
                method: 'POST',
                body: JSON.stringify(credentials)
            })
            .then(res => extractJson(res))
            .then(json => {
                const token = json.token
                if (!token || token.length < 0) {
                    throw new Error('no token in response');
                }
                storeToken(token);
                return dispatch({type: AUTH_FULFILLED, payload: token})
            })
            .catch(err => {
                return dispatch({type: AUTH_REJECTED, payload: err})
            });
    };
}