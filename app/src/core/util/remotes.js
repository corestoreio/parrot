const apiRoot = 'http://localhost:8080/api';

const Remotes = {
    authPath: () => apiRoot + '/authenticate',
    registerPath: () => apiRoot + '/users',
    projectsPath: () => apiRoot + '/projects',
    projectPath: (id) => `${Remotes.projectsPath()}/${id}`,
    localesPath: (projectId) => `${Remotes.projectPath(projectId)}/locales`,
    localePath: (projectId, localeId) => `${Remotes.localesPath(projectId)}/${localeId}`
}

export default Remotes;