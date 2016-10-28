import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import App from './app';
import Home from './components/home';
import NotFound from './components/404';
import Login from './containers/Login';
import Register from './containers/Register';
import Projects from './containers/Projects';
import { ProjectNew, ProjectShow, ProjectEdit } from './components/ProjectList';
import { Documents, DocumentNew, DocumentShow, DocumentEdit } from './components/documents';
import { fetchProjects } from './actions/projects';

const history = syncHistoryWithStore(browserHistory, store)

const AppRouter = () => (
	<Router history={history}>
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
);

ReactDOM.render(
	<Provider store={store}>
		<AppRouter history={history}/>
	</Provider>,
	document.getElementById('root')
);

store.subscribe(() => {
	console.log(store.getState());
})

store.dispatch(fetchProjects())
