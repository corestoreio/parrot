package api

import (
	"net/http"

	apiErrors "github.com/anthonynsimon/parrot/parrot-api/errors"
)

func enforceContentTypeJSON(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "POST", "PUT", "PATCH":
			ct := r.Header.Get("Content-Type")
			if !isValidContentType(ct) {
				handleError(w, apiErrors.ErrUnsupportedMediaType)
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
			handleError(w, apiErrors.ErrForbiden)
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
			handleError(w, apiErrors.ErrForbiden)
			return
		}
		next(w, r)
	}
}

func onlyUsers(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id, err := getSubjectID(r.Context())
		if err != nil || id == "" {
			handleError(w, apiErrors.ErrForbiden)
			return
		}
		next(w, r)
	}
}
