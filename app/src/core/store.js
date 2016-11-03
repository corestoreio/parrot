import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk';
import { browserHistory } from 'react-router';
import promiseMiddleware from 'redux-promise-middleware';

function configureStore() {
    return createStore(
        reducers,
        applyMiddleware(
            thunk,
            promiseMiddleware(),
            routerMiddleware(browserHistory)
        )
    );
}

export default configureStore;