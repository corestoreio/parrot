import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from './router';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reduxPromise from 'redux-promise-middleware';
import reducer from './reducers/combined';
import { authRequest } from './actions/auth';

const middleware = applyMiddleware(
	reduxPromise(),
	thunk
)

const store = createStore(reducer, middleware);

ReactDOM.render(
	<Provider store={store}>
		<AppRouter />
	</Provider>,
	document.getElementById('root')
);

store.subscribe(() => {
	console.log(store.getState())
})

store.dispatch(authRequest({
  email: "a@dude.com", password: "asdasd"
}))
