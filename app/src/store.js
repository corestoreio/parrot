import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware, push } from 'react-router-redux'
import thunk from 'redux-thunk';
import reduxPromise from 'redux-promise-middleware';
import reducer from './reducers/index';
import { getToken } from './helpers/token'
import { browserHistory } from 'react-router'

// const authRequired = (store) => (next) => (action) => {
// 	const token = getToken();
// 	if ((window.location.pathname !== '/login' || window.location.pathname !== '/register') && (token === null || token.length <= 0)) {
// 		return store.dispatch(push('/login'));
// 	}
// 	return next(action);
// }

const middleware = applyMiddleware(
	reduxPromise(),
	thunk,
	routerMiddleware(browserHistory)
);

const store = createStore(reducer, middleware);

export default store;