import { REGISTER_FULFILLED, REGISTER_PENDING, REGISTER_REJECTED } from './../actions/register';

const INITIAL_STATE = {
    pending: false
};

export default function registerReducer(state = INITIAL_STATE, action) {
    switch(action.type) {
        case REGISTER_PENDING:
            return {
                pending: true
            };
        case REGISTER_FULFILLED:
            return {
                pending: false
            };
        case REGISTER_REJECTED:
            return {
                pending: false
            };
        default:
            return state;
    }
}