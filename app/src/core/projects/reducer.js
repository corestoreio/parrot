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

        // Fetch project
        case projectActions.FETCH_PROJECT_PENDING:
            return {
                ...state,
                pending: true
            };
        case projectActions.FETCH_PROJECT_FULFILLED: {
            const activeProject = action.payload;
            const projects = state.projects.map((proj) => {
                if (proj.id === activeProject.id) {
                    return activeProject;
                }
                return proj;
            });
            projects.push(action.payload);

            return {
                ...state,
                pending: false,
                projects: projects
            };
        }
        case projectActions.FETCH_PROJECT_REJECTED:
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
