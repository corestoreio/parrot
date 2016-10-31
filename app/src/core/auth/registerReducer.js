import { registerActions } from './registerActions';

const INITIAL_STATE = {
    pending: false
};

export function registerReducer(state = INITIAL_STATE, action) {
    switch(action.type) {
        case registerActions.REGISTER_PENDING:
            return {
                pending: true
            };
        case registerActions.REGISTER_FULFILLED:
            return {
                pending: false
            };
        case registerActions.REGISTER_REJECTED:
            return {
                pending: false
            };
        default:
            return state;
    }
}