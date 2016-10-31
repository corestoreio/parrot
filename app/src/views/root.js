import React from 'react';
import { Router } from 'react-router'
import { Provider } from 'react-redux';
import routes from './routes';

function Root({history, store}) {
    return (
        <Provider store={store}>
            <Router
                history={history}
                routes={routes}
            />
        </Provider>
    );
}

Root.propTypes = {
    history: React.PropTypes.object.isRequired,
    store: React.PropTypes.object.isRequired
};

export default Root;