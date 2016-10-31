import { loginActions } from './loginActions.js';

const INITIAL_STATE = {
    token: '',
    pending: false,
    authenticated: false
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
                token: action.payload,
                pending: false,
                authenticated: true
            };
        case loginActions.LOGIN_REJECTED:
            return {
                ...state,
                pending: false,
                authenticated: false
            };
        default:
            return state;
    }
}