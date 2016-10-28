import { combineReducers } from 'redux';
import authReducer from './auth';
import registerReducer from './register';

export default combineReducers({
    auth: authReducer,
    registration: registerReducer
});