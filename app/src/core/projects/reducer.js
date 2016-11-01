import { projectActions } from './actions';

export function fetchProjectsReducer(state = [], action) {
    switch(action.type) {
        case projectActions.FETCH_PROJECTS_PENDING:
            return state;
        case projectActions.FETCH_PROJECTS_FULFILLED:
            return action.payload;
        case projectActions.FETCH_PROJECTS_REJECTED:
            return state;
        default:
            return state;
    }
}

export function fetchProjectReducer(state = {}, action) {
    switch(action.type) {
        case projectActions.FETCH_PROJECT_PENDING:
            return state;
        case projectActions.FETCH_PROJECT_FULFILLED:
            return action.payload;
        case projectActions.FETCH_PROJECT_REJECTED:
            return state;
        default:
            return state;
    }
}

const INITIAL_STATE = {
    pending: false,
    created: false,
    project: {}
};

export function createProjectReducer(state = INITIAL_STATE, action) {
    switch(action.type) {
        case projectActions.CREATE_PROJECT_PENDING:
            return {
                ...state,
                pending: true,
            };
        case projectActions.CREATE_PROJECT_FULFILLED:
            return {
                ...state,
                pending: false,
                created: true,
                project: action.payload
            };
        case projectActions.CREATE_PROJECT_REJECTED:
            return {
                ...state,
                pending: false,
                created: false,
                project: {}
            };
        default:
            return state;
    }
}