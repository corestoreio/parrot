export function getProject(state, id) {
    return state.projects.projects.find((element) => {
        return element.id === id;
    });
}