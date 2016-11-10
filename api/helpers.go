package api

import (
	"net/http"
	"strconv"

	"github.com/pressly/chi"

	"github.com/anthonynsimon/parrot/render"
)

var (
	validContentTypes = []string{
		"application/json",
		"application/json; charset=utf-8"}
)

type Authorizer func(string) bool

func mustAuthorize(fn Authorizer, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		projectID, err := strconv.Atoi(chi.URLParam(r, "projectID"))
		if err != nil {
			handleError(w, ErrBadRequest)
			return
		}
		requesterID, err := getUserIDFromContext(r.Context())
		if err != nil {
			handleError(w, ErrBadRequest)
			return
		}
		requesterRole, err := getProjectUserRole(requesterID, projectID)
		if err != nil {
			handleError(w, err)
			return
		}
		if !fn(requesterRole) {
			handleError(w, ErrForbiden)
			return
		}
		next.ServeHTTP(w, r)
	}
}

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

func options(w http.ResponseWriter, r *http.Request) {
	render.JSON(w, http.StatusOK, nil)
}
