import fetch from 'isomorphic-fetch'
import Remotes from './../util/remotes'
import { extractJson } from './../util/fetch'
import { storeToken } from './../util/token'
import { browserHistory } from 'react-router'

export const loginActions = {
    LOGIN: 'LOGIN',
    LOGIN_PENDING: 'LOGIN_PENDING',
    LOGIN_REJECTED: 'LOGIN_REJECTED',
    LOGIN_FULFILLED: 'LOGIN_FULFILLED',

    login: (credentials) => {
        return (dispatch) => {
            dispatch({type: loginActions.LOGIN_PENDING})
            return fetch(Remotes.authPath(), {
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
                    return dispatch({type: loginActions.LOGIN_FULFILLED, payload: token})
                })
                .catch(err => {
                    return dispatch({type: loginActions.LOGIN_REJECTED, payload: err})
                });
        };
    }
}
