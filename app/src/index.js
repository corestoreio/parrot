import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from './router';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers/combined';
import { authRequest } from './actions/auth';

const store = createStore(
	reducer,
	applyMiddleware(
		thunk,
	)
);

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
