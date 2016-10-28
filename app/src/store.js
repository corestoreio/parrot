import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reduxPromise from 'redux-promise-middleware';
import reducer from './reducers/index';
import { authRequest } from './actions/auth';

const middleware = applyMiddleware(
	reduxPromise(),
	thunk
);

const store = createStore(reducer, middleware);

export default store;