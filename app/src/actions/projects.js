import fetch from 'isomorphic-fetch'
import Paths from './../paths'
import { extractJson } from './../helpers/fetch'
import { getToken } from './../helpers/token'

export const FETCH_PROJECTS = 'FETCH_PROJECTS'
export const FETCH_PROJECTS_PENDING = 'FETCH_PROJECTS_PENDING'
export const FETCH_PROJECTS_REJECTED = 'FETCH_PROJECTS_REJECTED'
export const FETCH_PROJECTS_FULFILLED = 'FETCH_PROJECTS_FULFILLED'

export function fetchProjects(user) {
    return (dispatch) => {
        dispatch({type: FETCH_PROJECTS_PENDING})
        return fetch(Paths.apiRoot + Paths.projects + '/2', {
            method: 'GET',
            headers: {
                "Accept": 'application/json',
                "Authorization": getToken()
            }
        })
            .then(res => extractJson(res))
            .then(json => {
                return dispatch({type: FETCH_PROJECTS_FULFILLED, payload: [json]})
            })
            .catch(err => {
                return dispatch({type: FETCH_PROJECTS_REJECTED, payload: err})
            });
    };
}