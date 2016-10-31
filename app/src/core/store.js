import { applyMiddleware, compose, createStore } from 'redux';

function configureStore() {
    let middleware = applyMiddleware();
    const store = createStore(()=>{}, middleware);
    return store;
}

export default configureStore;