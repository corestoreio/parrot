import fetch from 'isomorphic-fetch'
import Remotes from './../util/remotes'
import { extractJson } from './../util/fetch'
import { getToken } from './../util/token'

export const projectActions = {
    FETCH_PROJECTS: 'FETCH_PROJECTS',
    FETCH_PROJECTS_PENDING: 'FETCH_PROJECTS_PENDING',
    FETCH_PROJECTS_REJECTED: 'FETCH_PROJECTS_REJECTED',
    FETCH_PROJECTS_FULFILLED: 'FETCH_PROJECTS_FULFILLED',

    fetchProjects: (user) => {
        return (dispatch) => {
            dispatch({type: projectActions.FETCH_PROJECTS_PENDING})
            return fetch(Remotes.projectsPath(), {
                method: 'GET',
                headers: {
                    "Accept": 'application/json',
                    "Authorization": getToken()
                }
            })
                .then(res => extractJson(res))
                .then(json => {
                    return dispatch({type: projectActions.FETCH_PROJECTS_FULFILLED, payload: [json]})
                })
                .catch(err => {
                    return dispatch({type: projectActions.FETCH_PROJECTS_REJECTED, payload: err})
                });
        };
    }
};
