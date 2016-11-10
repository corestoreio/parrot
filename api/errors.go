package api

import (
	"net/http"

	"github.com/anthonynsimon/parrot/errors"
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
