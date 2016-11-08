package errors

import (
	"fmt"
	"net/http"
)

var (
	ErrConflict = New(
		http.StatusConflict,
		"Conflict",
		http.StatusText(http.StatusConflict))
	ErrAlreadyExists = New(
		http.StatusConflict,
		"AlreadyExists",
		"entry already exists")
	ErrDuplicateEntry = New(
		http.StatusConflict,
		"DuplicateEntry",
		"duplicate entry")
	ErrNotImplemented = New(
		http.StatusNotImplemented,
		"NotImplemented",
		http.StatusText(http.StatusNotImplemented))
	ErrInternal = New(
		http.StatusInternalServerError,
		"Internal",
		http.StatusText(http.StatusInternalServerError))
	ErrUnauthorized = New(
		http.StatusUnauthorized,
		"Unauthorized",
		http.StatusText(http.StatusUnauthorized))
	ErrForbiden = New(
		http.StatusForbidden,
		"Forbiden",
		http.StatusText(http.StatusForbidden))
	ErrNotFound = New(
		http.StatusNotFound,
		"NotFound",
		http.StatusText(http.StatusNotFound))
	ErrBadRequest = New(
		http.StatusBadRequest,
		"BadRequest",
		http.StatusText(http.StatusBadRequest))
)

type Error struct {
	Status  int    `json:"status"`
	Type    string `json:"type"`
	Message string `json:"message"`
}

func New(s int, t, m string) *Error {
	return &Error{Status: s, Type: t, Message: m}
}

type MultiError struct {
	Errors []Error `json:"errors,omitempty"`
}

func (e *Error) Error() string {
	return fmt.Sprintf("error: status: %d type: %s message: %s", e.Status, e.Type, e.Message)
}

func (e *MultiError) Error() string {
	result := ""
	for _, err := range e.Errors {
		result += fmt.Sprintf("%s\n", err.Error())
	}
	return result
}
