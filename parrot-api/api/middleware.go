package api

import "net/http"

func enforceContentTypeJSON(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "POST", "PUT", "PATCH":
			ct := r.Header.Get("Content-Type")
			if !isValidContentType(ct) {
				handleError(w, ErrUnsupportedMediaType)
				return
			}
		}

		next.ServeHTTP(w, r)
	})
}

func mustAllowScope(scope string, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		scopes, err := getScopes(r.Context())
		if err != nil || len(scopes) <= 0 {
			handleError(w, ErrForbiden)
			return
		}
		allowed := false
		for _, s := range scopes {
			if s == scope {
				allowed = true
				break
			}
		}
		if !allowed {
			handleError(w, ErrForbiden)
			return
		}
		next(w, r)
	}
}

func onlyUsers(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id, err := getSubjectID(r.Context())
		if err != nil || id == "" {
			handleError(w, ErrForbiden)
			return
		}
		next(w, r)
	}
}
