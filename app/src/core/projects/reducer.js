import { projectActions } from './actions';

const INITIAL_STATE = {
    pending: false,
    created: false,
    projects: []
};

export function projectsReducer(state = INITIAL_STATE, action) {
    switch(action.type) {
        // Fetch projects
        case projectActions.FETCH_PROJECTS_PENDING:
            return {
                ...state,
                pending: true
            };
        case projectActions.FETCH_PROJECTS_FULFILLED:
            return {
                ...state,
                pending: false,
                projects: action.payload
            };
        case projectActions.FETCH_PROJECTS_REJECTED:
            return {
                ...state,
                pending: false
            };

        // Update project
        case projectActions.UPDATE_PROJECT_PENDING:
            return {
                ...state,
                pending: true,
            };
        case projectActions.UPDATE_PROJECT_FULFILLED: {
            const updatedProject = action.payload;
            const result = state.projects.filter((proj) => {
                if (proj.id === updatedProject.id) {
                    return false;
                }
                return true;
            });
            result.push(updatedProject);

            return {
                ...state,
                pending: false,
                created: true,
                projects: result
            };
        }
        case projectActions.UPDATE_PROJECT_REJECTED:
            return {
                ...state,
                pending: false
            };

        // Create project
        case projectActions.CREATE_PROJECT_PENDING:
            return {
                ...state,
                pending: true,
            };
        case projectActions.CREATE_PROJECT_FULFILLED: {
            let projects = state.projects.slice();
            projects.push(action.payload);

            return {
                ...state,
                pending: false,
                created: true,
                projects: projects
            };
        }
        case projectActions.CREATE_PROJECT_REJECTED:
            return {
                ...state,
                pending: false
            };


        default:
            return state;
    }
}
