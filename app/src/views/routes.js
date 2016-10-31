import App from './app';
import HomePage from './pages/Home';
import NotFound from './pages/NotFound';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ProjectsPage from './pages/Projects';
import ProjectPage from './pages/Project';
import NewProjectPage from './pages/NewProject';
import NewLocalePage from './pages/NewLocale';

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
            path: 'login',
            component: LoginPage
        },
        {
            path: 'register',
            component: RegisterPage
        },
        {
            path: 'projects',
            childRoutes: [
                {
                    indexRoute: {
                        component: ProjectsPage
                    }
                },
                {
                    path: 'new',
                    component: NewProjectPage
                },
                {
                    path: ':projectId',
                    childRoutes: [
                        {
                            indexRoute: {
                                component: ProjectPage
                            }
                        },
                        {
                            path: 'locales',
                            childRoutes: [
                                {
                                    indexRoute: {
                                        component: HomePage
                                    },
                                },
                                {
                                    path: 'new',
                                    component: NewLocalePage
                                },
                                {
                                    path: ':localeId',
                                    component: HomePage
                                },
                            ]
                        },
                    ]
                },
            ]
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