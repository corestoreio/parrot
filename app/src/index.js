import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import Root from './views/root';
import configureStore from './core/store';
import { getToken } from './core/util/token'
import { loginActions } from './core/auth';

const store = configureStore();

store.subscribe(() => {
	console.log(store.getState());
});

const history = syncHistoryWithStore(browserHistory, store)

function render(Root) {
    ReactDOM.render(
        <Root
            history={history}
            store={store}
        />,
        document.getElementById('root')
    );
}

render(Root);

const token = getToken();
if (token === '') {
    browserHistory.push('/login');
} else {
    store.dispatch({
        type: loginActions.LOGIN_FULFILLED,
        payload: token
    })
}