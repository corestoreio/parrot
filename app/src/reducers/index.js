import { combineReducers } from 'redux';
import authReducer from './auth';
import registerReducer from './register';
import projectsReducer from './projects';
import { routerReducer } from 'react-router-redux'

export default combineReducers({
    auth: authReducer,
    registration: registerReducer,
    projects: projectsReducer,
    routing: routerReducer
});