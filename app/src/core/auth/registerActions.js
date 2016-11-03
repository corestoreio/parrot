import { apiRequest } from './../util/api';
import Remotes from './../util/remotes';
import { login } from './loginActions';

export const registerActions = {
    REGISTER: 'REGISTER',
    REGISTER_PENDING: 'REGISTER_PENDING',
    REGISTER_REJECTED: 'REGISTER_REJECTED',
    REGISTER_FULFILLED: 'REGISTER_FULFILLED'
}

export function register(user) {
    return (dispatch) => {
        return {
            type: registerActions.REGISTER,
            payload: apiRequest({
                method: 'POST',
                path: Remotes.registerPath(),
                body: JSON.stringify(user),
                includeAuth: false
            })
                .then(json => {
                    return dispatch(login(user))
                })
        };
    };
}