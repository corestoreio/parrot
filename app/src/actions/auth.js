import fetch from 'isomorphic-fetch'
import Paths from './../paths'

export const AUTH = 'AUTH'
export const AUTH_PENDING = 'AUTH_PENDING'
export const AUTH_REJECTED = 'AUTH_REJECTED'
export const AUTH_FULFILLED = 'AUTH_FULFILLED'

export function authRequest(credentials) {
    return {
        type: AUTH,
        payload: fetch(Paths.apiRoot + Paths.authenticate, {
                method: 'POST',
                body: JSON.stringify(credentials)
            })
    }
}