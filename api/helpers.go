package api

import (
	"net/http"
	"strconv"

	"github.com/Sirupsen/logrus"
	datastoreErrors "github.com/anthonynsimon/parrot/datastore/errors"
	apiErrors "github.com/anthonynsimon/parrot/errors"
	"github.com/anthonynsimon/parrot/render"
	"github.com/pressly/chi"
)

type Authorizer func(string) bool

func mustAuthorize(fn Authorizer, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		projectID, err := strconv.Atoi(chi.URLParam(r, "projectID"))
		if err != nil {
			handleError(w, apiErrors.ErrBadRequest)
			return
		}
		requesterID, err := getUserIDFromContext(r.Context())
		if err != nil {
			handleError(w, apiErrors.ErrBadRequest)
			return
		}
		requesterRole, err := getProjectUserRole(requesterID, projectID)
		if err != nil {
			handleError(w, err)
			return
		}
		if !fn(requesterRole) {
			handleError(w, apiErrors.ErrForbiden)
			return
		}
		next.ServeHTTP(w, r)
	}
}

func handleError(w http.ResponseWriter, err error) {
	// Try to match store error
	var outErr *apiErrors.Error
	// If cast is successful, done, we got our error
	if castedErr, ok := err.(*apiErrors.Error); ok {
		outErr = castedErr
	} else {
		// Check if it is a datastore error
		switch err {
		case datastoreErrors.ErrNotFound:
			outErr = apiErrors.ErrNotFound
		case datastoreErrors.ErrAlreadyExists:
			outErr = apiErrors.ErrAlreadyExists
		default:
			// If no match was found, log it and write internal error to response
			// TODO: conform error tags in log
			logrus.Error(err)
			outErr = apiErrors.ErrInternal

		}
	}

	render.Error(w, outErr.Status, outErr)
}
