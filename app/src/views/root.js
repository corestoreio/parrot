import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router'
import App from './app';
import HomePage from './pages/Home';
import NotFound from './pages/NotFound';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ProjectsPage from './pages/Projects';
import ProjectPage from './pages/Project';
import NewProjectPage from './pages/NewProject';
import NewLocalePage from './pages/NewLocale';
import LocalePage from './pages/Locale';
import EditLocalePage from './pages/EditLocale';

function Root({history, store}) {
    return (
        <Provider store={store}>
            <Router history={history}>
                <Route path="/" component={App}>
                    <IndexRoute component={HomePage} />
                    <Route path="login" component={LoginPage}/>
                    <Route path="register" component={RegisterPage}/>
                    <Route path="projects">
                        <IndexRoute component={ProjectsPage}/>
                        <Route path="new" component={NewProjectPage}/>
                        <Route path=":projectId">
                            <IndexRoute component={ProjectPage} />
                            <Route path="locales">
                                <Route path="new" component={NewLocalePage}/>
                                <Route path=":localeId">
                                    <IndexRoute component={LocalePage}/>
                                    <Route path="edit" component={EditLocalePage}/>
                                </Route>
                            </Route>
                        </Route>
                    </Route>
                    <Route path="*" component={NotFound} />
                </Route>
            </Router>
        </Provider>
    );
}

Root.propTypes = {
    history: React.PropTypes.object.isRequired,
    store: React.PropTypes.object.isRequired
};

export default Root;