import { projectActions } from './actions';

export function projectReducer(state = [], action) {
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