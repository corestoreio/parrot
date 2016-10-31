import fetch from 'isomorphic-fetch'
import Remotes from './../util/remotes'
import { extractJson } from './../util/fetch'
import { storeToken } from './../util/token'
import { browserHistory } from 'react-router'

export const authActions = {
    AUTH: 'AUTH',
    AUTH_PENDING: 'AUTH_PENDING',
    AUTH_REJECTED: 'AUTH_REJECTED',
    AUTH_FULFILLED: 'AUTH_FULFILLED',

    authenticate: (credentials) => {
        return (dispatch) => {
            dispatch({type: authActions.AUTH_PENDING})
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
                    browserHistory.push('/');
                    return dispatch({type: authActions.AUTH_FULFILLED, payload: token})
                })
                .catch(err => {
                    return dispatch({type: authActions.AUTH_REJECTED, payload: err})
                });
        };
    }
}
