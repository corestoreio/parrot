import fetch from 'isomorphic-fetch'
import Remotes from './../util/remotes'
import { loginActions } from './loginActions';

export const registerActions = {
    REGISTER: 'REGISTER',
    REGISTER_PENDING: 'REGISTER_PENDING',
    REGISTER_REJECTED: 'REGISTER_REJECTED',
    REGISTER_FULFILLED: 'REGISTER_FULFILLED',

    register: (user) => {
        return (dispatch) => {
            dispatch({type: registerActions.REGISTER_PENDING})
            return fetch(Remotes.registerPath(), {
                    method: 'POST',
                    body: JSON.stringify(user)
                })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('request failed');
                    }
                    dispatch({type: registerActions.REGISTER_FULFILLED})
                    return dispatch(loginActions.login(user))
                })
                .catch(err => {
                    return dispatch({type: registerActions.REGISTER_REJECTED, payload: err})
                });
        };
    }
};