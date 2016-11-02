import fetch from 'isomorphic-fetch'
import Remotes from './../util/remotes'
import { extractJson } from './../util/fetch'
import { getToken } from './../util/token'

export const projectActions = {
    CREATE_PROJECT: 'CREATE_PROJECT',
    CREATE_PROJECT_PENDING: 'CREATE_PROJECT_PENDING',
    CREATE_PROJECT_REJECTED: 'CREATE_PROJECT_REJECTED',
    CREATE_PROJECT_FULFILLED: 'CREATE_PROJECT_FULFILLED',

    FETCH_PROJECT: 'FETCH_PROJECT',
    FETCH_PROJECT_PENDING: 'FETCH_PROJECT_PENDING',
    FETCH_PROJECT_REJECTED: 'FETCH_PROJECT_REJECTED',
    FETCH_PROJECT_FULFILLED: 'FETCH_PROJECT_FULFILLED',
    
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
                    return dispatch({type: projectActions.FETCH_PROJECTS_FULFILLED, payload: json})
                })
                .catch(err => {
                    return dispatch({type: projectActions.FETCH_PROJECTS_REJECTED, payload: err})
                });
        };
    },

    fetchProject: (id) => {
        return (dispatch) => {
            dispatch({type: projectActions.FETCH_PROJECT_PENDING})
            return fetch(Remotes.projectPath(id), {
                method: 'GET',
                headers: {
                    "Accept": 'application/json',
                    "Authorization": getToken()
                }
            })
                .then(res => extractJson(res))
                .then(json => {
                    return dispatch({type: projectActions.FETCH_PROJECT_FULFILLED, payload: json})
                })
                .catch(err => {
                    return dispatch({type: projectActions.FETCH_PROJECT_REJECTED, payload: err})
                });
        };
    },

    createProject: (project) => {
        return (dispatch) => {
            dispatch({type: projectActions.CREATE_PROJECT_PENDING})
            return fetch(Remotes.projectsPath(), {
                method: 'POST',
                headers: {
                    "Accept": 'application/json',
                    "Authorization": getToken()
                },
                body: JSON.stringify(project)
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('request failed');
                    }
                    return extractJson(res);
                })
                .then(json => {
                    return dispatch({type: projectActions.CREATE_PROJECT_FULFILLED, payload: json})
                })
                .catch(err => {
                    return dispatch({type: projectActions.CREATE_PROJECT_REJECTED, payload: err})
                });
        };
    }
};
