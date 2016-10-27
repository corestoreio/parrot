import { AUTH_PENDING, AUTH_FULFILLED, AUTH_REJECTED } from './../actions/auth'

const INITIAL_STATE = {
    token: '',
    pending: false,
    authenticated: false
}

export default function authReducer(state = INITIAL_STATE, action) {
    switch(action.type) {
        case AUTH_PENDING:
            return {
                ...state,
                pending: true
            }
        case AUTH_FULFILLED:
            const response = action.payload
            const token = response.token
            if (response.status !== 200 || token === null) {
                return {
                    ...state,
                    pending: false,
                    authenticated: false
                }
            }
            return {
                ...state,
                token: token,
                pending: false,
                authenticated: true
            }
        case AUTH_REJECTED:
            return {
                ...state,
                pending: false,
                authenticated: false
            }
        default:
            return state;
    }
}