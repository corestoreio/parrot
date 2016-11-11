package api

import (
	"net/http"

	"github.com/anthonynsimon/parrot/render"
)

var (
	validContentTypes = []string{
		"application/json",
		"application/json; charset=utf-8"}
)

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

func isValidContentType(ct string) bool {
	if ct == "" {
		return false
	}
	for _, v := range validContentTypes {
		if ct == v {
			return true
		}
	}
	return false
}

func ping(w http.ResponseWriter, r *http.Request) {
	render.JSON(w, http.StatusOK, map[string]interface{}{
		"message": "Parrot says hello.",
	})
}
