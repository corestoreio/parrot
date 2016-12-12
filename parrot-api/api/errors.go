package api

import (
	"net/http"

	"github.com/Sirupsen/logrus"
	datastoreErrors "github.com/anthonynsimon/parrot/common/datastore/errors"
	"github.com/anthonynsimon/parrot/common/errors"
	"github.com/anthonynsimon/parrot/common/render"
)

var (
	ErrAlreadyExists = errors.New(
		http.StatusConflict,
		"AlreadyExists",
		"entry already exists")
	ErrInternal = errors.New(
		http.StatusInternalServerError,
		"Internal",
		http.StatusText(http.StatusInternalServerError))
	ErrUnauthorized = errors.New(
		http.StatusUnauthorized,
		"Unauthorized",
		http.StatusText(http.StatusUnauthorized))
	ErrForbiden = errors.New(
		http.StatusForbidden,
		"Forbiden",
		http.StatusText(http.StatusForbidden))
	ErrNotFound = errors.New(
		http.StatusNotFound,
		"NotFound",
		http.StatusText(http.StatusNotFound))
	ErrBadRequest = errors.New(
		http.StatusBadRequest,
		"BadRequest",
		http.StatusText(http.StatusBadRequest))
	ErrUnprocessable = errors.New(
		http.StatusUnprocessableEntity,
		"UnprocessableEntity",
		http.StatusText(http.StatusUnprocessableEntity))
	ErrUnsupportedMediaType = errors.New(
		http.StatusUnsupportedMediaType,
		"UnsupportedMediaType",
		http.StatusText(http.StatusUnsupportedMediaType))
)

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
			logrus.Error(err)
			outErr = ErrInternal

		}
	}

	render.Error(w, outErr.Status, outErr)
}
