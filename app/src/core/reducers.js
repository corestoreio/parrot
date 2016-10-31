import { combineReducers } from 'redux';
import { authReducers } from './auth';
import { projectReducers } from './projects';
import { routerReducer } from 'react-router-redux'

export default combineReducers({
    auth: authReducers,
    projects: projectReducers,
    routing: routerReducer
});