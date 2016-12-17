package api

import (
	"net/http"

	"github.com/Sirupsen/logrus"
	datastoreErrors "github.com/anthonynsimon/parrot/parrot-api/datastore/errors"
	apiErrors "github.com/anthonynsimon/parrot/parrot-api/errors"
	"github.com/anthonynsimon/parrot/parrot-api/render"
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
			logrus.Error(err)
			outErr = apiErrors.ErrInternal

		}
	}

	render.Error(w, outErr.Status, outErr)
}
