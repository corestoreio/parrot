import { combineReducers } from 'redux';
import { authReducers } from './auth';
import { routerReducer } from 'react-router-redux'

export default combineReducers({
    auth: authReducers,
    routing: routerReducer
});