import { combineReducers } from 'redux';
import { projectReducer, createProjectReducer } from './reducer';

export { projectActions } from './actions';

export const projectReducers = combineReducers({
    projects: projectReducer,
    newProject: createProjectReducer
});

