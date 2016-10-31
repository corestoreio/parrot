import { authActions } from './actions';

const INITIAL_STATE = {
    token: '',
    pending: false,
    authenticated: false
};

export function authReducer(state = INITIAL_STATE, action) {
    switch(action.type) {
        case authActions.AUTH_PENDING:
            return {
                ...state,
                pending: true
            };
        case authActions.AUTH_FULFILLED:
            return {
                ...state,
                token: action.payload,
                pending: false,
                authenticated: true
            };
        case authActions.AUTH_REJECTED:
            return {
                ...state,
                pending: false,
                authenticated: false
            };
        default:
            return state;
    }
}