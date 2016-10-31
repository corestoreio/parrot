import { combineReducers } from 'redux';
import { loginReducer } from './loginReducer';
import { registerReducer } from './registerReducer';

export { loginActions } from './loginActions';
export { registerActions } from './registerActions';

export const authReducers = combineReducers({
    login: loginReducer,
    registration: registerReducer
});

