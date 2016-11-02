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
                <Route path="/" component={App} name="Home">
                    <IndexRoute component={HomePage} />
                    <Route path="login" component={LoginPage} name="Login" />
                    <Route path="register" component={RegisterPage} name="Register" />
                    <Route path="projects" name="Projects" >
                        <IndexRoute component={ProjectsPage} />
                        <Route path="new" component={NewProjectPage} name="New Project" />
                        <Route path=":projectId" >
                            <IndexRoute component={ProjectPage} />
                            <Route path="locales" name="Locales" >
                                <Route path="new" component={NewLocalePage} name="New Locale" />
                                <Route path=":localeId">
                                    <IndexRoute component={LocalePage} />
                                    <Route path="edit" component={EditLocalePage} name="Edit" />
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