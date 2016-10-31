import { applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk';
import { browserHistory } from 'react-router';

const middleware = applyMiddleware(
	thunk,
	routerMiddleware(browserHistory)
);

export default middleware;
