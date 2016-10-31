import React from 'react'
// import { Route, IndexRoute } from 'react-router'
import App from './app';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import LoginPage from './pages/Login';
// import Register from './pages/Register';

// export default function routes() {
//     return (
//         <Route path="/" component={App}>
//             <IndexRoute component={Home}/>
//             <Route path="login" component={LoginPage}/>
//             <Route path="*" component={NotFound}/>
//         </Route>
//     );
// }

const routes = {
    path: '/',
    component: App,
    childRoutes: [
        {
            indexRoute: {
                component: Home
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