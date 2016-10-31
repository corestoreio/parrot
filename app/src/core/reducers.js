import { combineReducers } from 'redux';
import { authReducer } from './auth';
import { routerReducer } from 'react-router-redux'

export default combineReducers({
    auth: authReducer,
    routing: routerReducer
});