package api

import (
	"net/http"
	"strconv"

	"github.com/Sirupsen/logrus"
	datastoreErrors "github.com/anthonynsimon/parrot/datastore/errors"
	"github.com/anthonynsimon/parrot/errors"
	"github.com/anthonynsimon/parrot/render"
	"github.com/pressly/chi"
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

func handleError(w http.ResponseWriter, err error) {
	// Try to match store error
	var outErr *errors.Error
	// If cast is successful, done, we got our error
	if castedErr, ok := err.(*errors.Error); ok {
		outErr = castedErr
	} else {
		// Check if it is a datastore error
		switch err {
		case datastoreErrors.ErrNotFound:
			outErr = ErrNotFound
		case datastoreErrors.ErrAlreadyExists:
			outErr = ErrAlreadyExists
		default:
			// If no match was found, log it and write internal error to response
			// TODO: conform error tags in log
			logrus.Error(err)
			outErr = ErrInternal

		}
	}

	render.Error(w, outErr.Status, outErr)
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
