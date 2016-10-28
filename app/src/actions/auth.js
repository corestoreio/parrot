import fetch from 'isomorphic-fetch'
import Paths from './../paths'

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
            .then(res => {
                if (!res.ok) {
                    throw new Error('request failed');
                }
                return res.json();
            })
            .then(json => {
                const token = json.token
                if (!token || token.length < 0) {
                    throw new Error('no token in response');
                }
                return dispatch({type: AUTH_FULFILLED, payload: token})
            })
            .catch(err => {
                return dispatch({type: AUTH_REJECTED, payload: err})
            });
    };
}