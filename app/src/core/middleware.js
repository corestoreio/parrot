import { applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk';
import { browserHistory } from 'react-router';
// import reduxPromise from 'redux-promise-middleware';

const middleware = applyMiddleware(
	// reduxPromise(),
	thunk,
	routerMiddleware(browserHistory)
);

export default middleware;
