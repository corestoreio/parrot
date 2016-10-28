import fetch from 'isomorphic-fetch'
import Paths from './../paths'
import { authenticate } from './auth';

export const REGISTER = 'REGISTER'
export const REGISTER_PENDING = 'REGISTER_PENDING'
export const REGISTER_REJECTED = 'REGISTER_REJECTED'
export const REGISTER_FULFILLED = 'REGISTER_FULFILLED'

export function register(user) {
    return (dispatch) => {
        dispatch({type: REGISTER_PENDING})
        return fetch(Paths.apiRoot + Paths.register, {
                method: 'POST',
                body: JSON.stringify(user)
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error('request failed');
                }
                dispatch({type: REGISTER_FULFILLED})
                return dispatch(authenticate(user))
            })
            .catch(err => {
                return dispatch({type: REGISTER_REJECTED, payload: err})
            });
    };
}