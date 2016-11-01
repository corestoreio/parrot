import { combineReducers } from 'redux';
import { fetchProjectsReducer, fetchProjectReducer, createProjectReducer } from './reducer';

export { projectActions } from './actions';

export const projectReducers = combineReducers({
    projectList: fetchProjectsReducer,
    projectShow: fetchProjectReducer,
    newProject: createProjectReducer
});

