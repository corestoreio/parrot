import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import Root from './views/root';
import configureStore from './core/store';

const store = configureStore();

store.subscribe(() => {
	console.log(store.getState());
});

function render(Root) {
    ReactDOM.render(
        <Root
            history={browserHistory}
            store={store}
        />,
        document.getElementById('root')
    );
}

render(Root);