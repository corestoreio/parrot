import { localeActions } from './actions';

const INITIAL_STATE = {
    pending: false,
    created: false,
    activeLocales: []
};

export function localesReducer(state = INITIAL_STATE, action) {
    switch(action.type) {
        // Fetch projects
        case localeActions.FETCH_LOCALES_PENDING:
            return {
                ...state,
                pending: true
            };
        case localeActions.FETCH_LOCALES_FULFILLED:
            return {
                ...state,
                pending: false,
                projects: action.payload
            };
        case localeActions.FETCH_LOCALES_REJECTED:
            return {
                ...state,
                pending: false
            };

        // Fetch project
        case localeActions.FETCH_LOCALE_PENDING:
            return {
                ...state,
                pending: true
            };
        case localeActions.FETCH_LOCALE_FULFILLED: {
            const activeLocale = action.payload;
            const result = state.activeLocales.filter((loc) => {
                if (loc.ident === activeLocale.ident) {
                    return false;
                }
                return true;
            });
            result.push(activeLocale);

            return {
                ...state,
                pending: false,
                projects: result
            };
        }
        case localeActions.FETCH_LOCALE_REJECTED:
            return {
                ...state,
                pending: false
            };

        // Create project
        case localeActions.CREATE_LOCALE_PENDING:
            return {
                ...state,
                pending: true,
            };
        case localeActions.CREATE_LOCALE_FULFILLED: {
            let activeLocales = state.activeLocales.slice();
            activeLocales.push(action.payload);

            return {
                ...state,
                pending: false,
                created: true,
                activeLocales: activeLocales
            };
        }
        case localeActions.CREATE_LOCALE_REJECTED:
            return {
                ...state,
                pending: false
            };


        default:
            return state;
    }
}
