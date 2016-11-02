const apiRoot = 'http://localhost:8080/api';

const Remotes = {
    authPath: () => apiRoot + '/authenticate',
    registerPath: () => apiRoot + '/users',
    projectsPath: () => apiRoot + '/projects',
    localesPath: (projectId) => apiRoot + '/projects/' + projectId + '/locales',
    localePath: (projectId, localeIdent) => Remotes.localesPath(projectId) + `/${localeIdent}`
}

export default Remotes;