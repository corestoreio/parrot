import { loginActions } from './loginActions.js';

const INITIAL_STATE = {
    pending: false,
    authenticated: false,
    error: null
};

export function loginReducer(state = INITIAL_STATE, action) {
    switch(action.type) {
        case loginActions.LOGIN_PENDING:
            return {
                ...state,
                pending: true
            };
        case loginActions.LOGIN_FULFILLED:
            return {
                ...state,
                pending: false,
                authenticated: true
            };
        case loginActions.LOGIN_REJECTED:
            return {
                ...state,
                pending: false,
                authenticated: false,
                error: action.payload
            };
        default:
            return state;
    }
}