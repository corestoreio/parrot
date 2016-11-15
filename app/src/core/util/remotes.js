const apiRoot = 'https:/localhost/api';

const Remotes = {
    authPath: () => apiRoot + '/authenticate',
    registerPath: () => apiRoot + '/users',
    projectsPath: () => apiRoot + '/projects',
    projectPath: (id) => `${Remotes.projectsPath()}/${id}`,
    localesPath: (projectId) => `${Remotes.projectPath(projectId)}/locales`,
    localePath: (projectId, localeIdent) => `${Remotes.localesPath(projectId)}/${localeIdent}`
}

export default Remotes;