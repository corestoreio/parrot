import Remotes from './../util/remotes';
import { apiRequest } from './../util/api';
import { storeToken } from './../util/token';

export const loginActions = {
    LOGIN: 'LOGIN',
    LOGIN_PENDING: 'LOGIN_PENDING',
    LOGIN_REJECTED: 'LOGIN_REJECTED',
    LOGIN_FULFILLED: 'LOGIN_FULFILLED'
};

export function login(credentials) {
    return {
        type: loginActions.LOGIN,
        payload: apiRequest({
            method: 'POST',
            path: Remotes.authPath(),
            body: JSON.stringify(credentials),
            includeAuth: false
        })
            .then(json => {
                const token = json.token;
                if (!token || token.length < 0) {
                    throw new Error('no token in response');
                }
                storeToken(token);
            })
    };
}