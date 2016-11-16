export function getLocale(state, ident) {
    let activeLocales = state.locales.activeLocales;
    if (activeLocales && ident) {
        for (let i = 0; i < activeLocales.length; i++) {
            if (activeLocales[i].ident === ident) {
                return activeLocales[i];
            }
        }
    }
    return null;
}