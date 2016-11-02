import { combineReducers } from 'redux';
import { authReducers } from './auth';
import { projectsReducer } from './projects';
import { localesReducer } from './locales';
import { routerReducer } from 'react-router-redux'

export default combineReducers({
    auth: authReducers,
    projects: projectsReducer,
    locales: localesReducer,
    routing: routerReducer
});