import { AUTH_FAIL, AUTH_SUCCESS } from './../actions/auth'

const INITIAL_STATE = {
    token: ''
}

export default function authReducer(state = INITIAL_STATE, action) {
    switch(action.type) {
        case AUTH_SUCCESS:
            return Object.assign({}, state, {
                token: action.payload
            })
        case AUTH_FAIL:
        default:
            return state;
    }
}