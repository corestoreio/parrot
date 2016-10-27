import fetch from 'isomorphic-fetch'

export const AUTH_RECEIVE = 'AUTH_RECEIVE'
export const AUTH_FAIL = 'AUTH_FAIL'
export const AUTH_SUCCESS = 'AUTH_SUCCESS'

export const authSuccess = (token) => {
    return {
        type: AUTH_SUCCESS,
        payload: token
    }
}

export const authFail = (err) => {
    return {
        type: AUTH_FAIL,
        payload: err
    }
}

export function authRequest(credentials) {
    return dispatch => {
        return fetch('http://localhost:8080/api/authenticate', {
                method: 'POST',
                body: JSON.stringify(credentials)
            })
            .then(res => res.json())
            .then(json => {
                const token = json.token
                if (token === null) {
                    return dispatch(authFail(json))
                }
                return dispatch(authSuccess(token))
            })
            .catch((err) => {
                return dispatch(authFail(err))
            })
    }
}