package errors

import (
	"fmt"
	"net/http"
)

var (
	ErrNotImplemented = New(http.StatusNotImplemented, http.StatusText(http.StatusNotImplemented))
	ErrInternal       = New(http.StatusInternalServerError, http.StatusText(http.StatusInternalServerError))
	ErrUnauthorized   = New(http.StatusUnauthorized, http.StatusText(http.StatusUnauthorized))
	ErrNotFound       = New(http.StatusNotFound, http.StatusText(http.StatusNotFound))
	ErrBadRequest     = New(http.StatusBadRequest, http.StatusText(http.StatusBadRequest))
)

type Error struct {
	Code    int
	Message string
}

func (e *Error) Error() string {
	return fmt.Sprintf("error: %d %s", e.Code, e.Error)
}

func New(c int, m string) *Error {
	return &Error{Code: c, Message: m}
}
