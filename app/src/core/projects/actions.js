import { apiRequest } from './../util/api';
import Remotes from './../util/remotes';

export const projectActions = {
    CREATE_PROJECT: 'CREATE_PROJECT',
    CREATE_PROJECT_PENDING: 'CREATE_PROJECT_PENDING',
    CREATE_PROJECT_REJECTED: 'CREATE_PROJECT_REJECTED',
    CREATE_PROJECT_FULFILLED: 'CREATE_PROJECT_FULFILLED',

    FETCH_PROJECTS: 'FETCH_PROJECTS',
    FETCH_PROJECTS_PENDING: 'FETCH_PROJECTS_PENDING',
    FETCH_PROJECTS_REJECTED: 'FETCH_PROJECTS_REJECTED',
    FETCH_PROJECTS_FULFILLED: 'FETCH_PROJECTS_FULFILLED',

    UPDATE_PROJECT: 'UPDATE_PROJECT',
    UPDATE_PROJECT_PENDING: 'UPDATE_PROJECT_PENDING',
    UPDATE_PROJECT_REJECTED: 'UPDATE_PROJECT_REJECTED',
    UPDATE_PROJECT_FULFILLED: 'UPDATE_PROJECT_FULFILLED'
}

export function fetchProjects(user) {
    return {
        type: projectActions.FETCH_PROJECTS,
        payload: apiRequest({
            method: 'GET',
            path: Remotes.projectsPath(),
            includeAuth: true
        })
    };
}

export function createProject(project) {
    return {
        type: projectActions.CREATE_PROJECT,
        payload: apiRequest({
            method: 'POST',
            path: Remotes.projectsPath(),
            body: JSON.stringify(project),
            includeAuth: true
        })
    };
}

export function updateProject(project) {
    return {
        type: projectActions.UPDATE_PROJECT,
        payload: apiRequest({
            method: 'PATCH',
            path: Remotes.projectPath(project.id) + '/keys',
            body: JSON.stringify(project.keys),
            includeAuth: true
        })
    };
}
