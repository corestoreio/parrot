import { localeActions } from './actions';

const INITIAL_STATE = {
    pending: false,
    created: false,
    activeLocales: []
};

export function localesReducer(state = INITIAL_STATE, action) {
    switch(action.type) {
        // Fetch locales
        case localeActions.FETCH_LOCALES_PENDING:
            return {
                ...state,
                pending: true
            };
        case localeActions.FETCH_LOCALES_FULFILLED:
            return {
                ...state,
                pending: false,
                activeLocales: action.payload
            };
        case localeActions.FETCH_LOCALES_REJECTED:
            return {
                ...state,
                pending: false
            };

        // Fetch locale
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
                activeLocales: result
            };
        }
        case localeActions.FETCH_LOCALE_REJECTED:
            return {
                ...state,
                pending: false
            };

        // Create locale
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

        // Update locale
        case localeActions.UPDATE_LOCALE_PENDING:
            return {
                ...state,
                pending: true,
            };
        case localeActions.UPDATE_LOCALE_FULFILLED: {
            const updatedLocale = action.payload;
            const activeLocales = state.activeLocales.filter((loc) => {
                if (loc.id === updatedLocale.id) {
                    return false;
                }
                return true;
            });
            activeLocales.push(updatedLocale);

            return {
                ...state,
                pending: false,
                created: true,
                activeLocales: activeLocales
            };
        }
        case localeActions.UPDATE_LOCALE_REJECTED:
            return {
                ...state,
                pending: false
            };


        default:
            return state;
    }
}
