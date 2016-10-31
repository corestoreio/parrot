import { createStore } from 'redux';
import reducers from './reducers';
import middleware from './middleware';

function configureStore() {
    const store = createStore(reducers, middleware);
    return store;
}

export default configureStore;