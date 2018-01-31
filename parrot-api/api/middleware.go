package api

import (
	"net/http"

	apiErrors "github.com/parrot-translate/parrot/parrot-api/errors"
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

func Cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		if r.Method == "OPTIONS" {
			// TODO: hacky
			w.WriteHeader(200)
			return
		}
		next.ServeHTTP(w, r)
	})
}
