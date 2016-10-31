import App from './app';
import HomePage from './pages/Home';
import NotFound from './pages/NotFound';
import LoginPage from './pages/Login';
// import Register from './pages/Register';

const routes = {
    path: '/',
    component: App,
    childRoutes: [
        {
            indexRoute: {
                component: HomePage
            }
        },
        {
            path: '/login',
            component: LoginPage
        },
        {
            path: '*',
            component: NotFound
        },
    ]
};

export default routes;

/*
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
*/