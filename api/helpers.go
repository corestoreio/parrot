package api

import (
	"net/http"

	"github.com/Sirupsen/logrus"
	datastoreErrors "github.com/anthonynsimon/parrot/datastore/errors"
	apiErrors "github.com/anthonynsimon/parrot/errors"
	"github.com/anthonynsimon/parrot/render"
)

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

	render.ErrorWithStatus(w, outErr.Status, outErr)
}
