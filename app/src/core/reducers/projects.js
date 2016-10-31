import { FETCH_PROJECTS_PENDING, FETCH_PROJECTS_FULFILLED, FETCH_PROJECTS_REJECTED } from './../actions/projects';

export default function authReducer(state = [], action) {
    switch(action.type) {
        case FETCH_PROJECTS_PENDING:
            return state;
        case FETCH_PROJECTS_FULFILLED:
            return action.payload;
        case FETCH_PROJECTS_REJECTED:
            return state;
        default:
            return state;
    }
}