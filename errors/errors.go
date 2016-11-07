package errors

import (
	"fmt"
	"net/http"
)

var (
	ErrConflict = New(
		http.StatusConflict,
		http.StatusConflict,
		http.StatusText(http.StatusConflict))
	ErrInvalidEmail = New(
		http.StatusBadRequest,
		7000,
		"invalid email")
	ErrInvalidPassword = New(
		http.StatusBadRequest,
		7001,
		"invalid password")
	ErrDuplicateEntry = New(
		http.StatusConflict,
		8000,
		"duplicate entry")
	ErrNotImplemented = New(
		http.StatusNotImplemented,
		http.StatusNotImplemented,
		http.StatusText(http.StatusNotImplemented))
	ErrInternal = New(
		http.StatusInternalServerError,
		http.StatusInternalServerError,
		http.StatusText(http.StatusInternalServerError))
	ErrUnauthorized = New(
		http.StatusUnauthorized,
		http.StatusUnauthorized,
		http.StatusText(http.StatusUnauthorized))
	ErrForbiden = New(
		http.StatusForbidden,
		http.StatusForbidden,
		http.StatusText(http.StatusForbidden))
	ErrNotFound = New(
		http.StatusNotFound,
		http.StatusNotFound,
		http.StatusText(http.StatusNotFound))
	ErrBadRequest = New(
		http.StatusBadRequest,
		http.StatusBadRequest,
		http.StatusText(http.StatusBadRequest))
)

type Error struct {
	Status  int
	Code    int
	Message string
}

func (e *Error) Error() string {
	return fmt.Sprintf("error: status: %d code: %d message: %s", e.Status, e.Code, e.Message)
}

func New(status, code int, message string) *Error {
	return &Error{Status: status, Code: code, Message: message}
}
