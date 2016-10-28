import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from './router';
import { Provider } from 'react-redux';
import store from './store';

store.subscribe(() => {
	console.log(store.getState());
})

ReactDOM.render(
	<Provider store={store}>
		<AppRouter />
	</Provider>,
	document.getElementById('root')
);