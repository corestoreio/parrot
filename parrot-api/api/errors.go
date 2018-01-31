package api

import (
	"net/http"

	"github.com/Sirupsen/logrus"
	datastoreErrors "github.com/parrot-translate/parrot/parrot-api/datastore/errors"
	apiErrors "github.com/parrot-translate/parrot/parrot-api/errors"
	"github.com/parrot-translate/parrot/parrot-api/render"
)

// handleError writes an error response.
// If the error is not a known API error, it will try to
// cast it or simply write an Internal error.
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
