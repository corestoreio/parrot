import { combineReducers } from 'redux';
import { authReducers } from './auth';
import { projectReducer } from './projects';
import { routerReducer } from 'react-router-redux'

export default combineReducers({
    auth: authReducers,
    projects: projectReducer,
    routing: routerReducer
});