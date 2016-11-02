import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk';
import { browserHistory } from 'react-router';

function configureStore() {
    return createStore(
        reducers,
        applyMiddleware(
            thunk,
            routerMiddleware(browserHistory)
        )
    );
}

export default configureStore;