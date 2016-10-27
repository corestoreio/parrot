import React from 'react';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'
import App from './app';
import Home from './home';
import NotFound from './404';
import { Login, Register } from './login';
import { Projects, ProjectNew, ProjectShow, ProjectEdit } from './projects';
import { Documents, DocumentNew, DocumentShow, DocumentEdit } from './documents';

export default class AppRouter extends React.Component {
    render() {
        return (
            <Router history={browserHistory}>
                <Route path="/" component={App}>
                    <IndexRoute component={Home}/>
                    <Route path="login" component={Login}/>
                    <Route path="register" component={Register}/>
                    <Route path="projects">
                        <IndexRoute component={Projects}/>
                        <Route path="new" component={ProjectNew}/>
                        <Route path=":projectId">
                            <IndexRoute component={ProjectShow}/>
                            <Route path="edit" component={ProjectEdit}/>
                            <Route path="documents">
                                <IndexRoute component={Documents}/>
                                <Route path="new" component={DocumentNew}/>
                                <Route path=":documentId">
                                    <IndexRoute component={DocumentShow}/>
                                    <Route path="edit" component={DocumentEdit}/>
                                </Route>
                            </Route>
                        </Route>
                    </Route>
                    <Route path="*" component={NotFound}/>
                </Route>
            </Router>
        )
    }
}