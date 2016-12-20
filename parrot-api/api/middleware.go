package api

import (
	"net/http"

	apiErrors "github.com/anthonynsimon/parrot/parrot-api/errors"
)

// enforceContentTypeJSON only allows requests that have the
// Content-Type header set to a valid JSON mime type, unless
// the body is empty (useful for 'verb' or 'action' requests).
func enforceContentTypeJSON(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "POST", "PUT", "PATCH":
			ct := r.Header.Get("Content-Type")
			if !isValidContentType(ct) && r.ContentLength > 0 {
				handleError(w, apiErrors.ErrUnsupportedMediaType)
				return
			}
		}

		next.ServeHTTP(w, r)
	})
}
