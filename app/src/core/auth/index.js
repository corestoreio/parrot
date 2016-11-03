import { combineReducers } from 'redux';
import { loginReducer } from './loginReducer';
import { registerReducer } from './registerReducer';

export * from './loginActions';
export * from './registerActions';

export const authReducers = combineReducers({
    login: loginReducer,
    registration: registerReducer
});

