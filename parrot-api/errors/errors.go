// Package errors holds the HTTP errors that the API returns.
package errors

import (
	"fmt"
	"net/http"
)

var (
	ErrAlreadyExists = New(
		http.StatusConflict,
		"AlreadyExists",
		"entry already exists")
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
	ErrUnprocessable = New(
		http.StatusUnprocessableEntity,
		"UnprocessableEntity",
		http.StatusText(http.StatusUnprocessableEntity))
	ErrUnsupportedMediaType = New(
		http.StatusUnsupportedMediaType,
		"UnsupportedMediaType",
		http.StatusText(http.StatusUnsupportedMediaType))
)

// Error holds the basic error struct.
type Error struct {
	Status  int    `json:"status,omitempty"`
	Type    string `json:"type"`
	Message string `json:"message"`
}

// New creates and returns an error based on the provided status, type and message.
func New(s int, t, m string) *Error {
	return &Error{Status: s, Type: t, Message: m}
}

// MultiError holds nested errors.
type MultiError struct {
	Status  int     `json:"status,omitempty"`
	Type    string  `json:"type"`
	Message string  `json:"message"`
	Errors  []Error `json:"errors,omitempty"`
}

// NewMultiError creates and returns an error with multiple nested errors.
func NewMultiError(s int, t, m string, errs []Error) *MultiError {
	return &MultiError{Status: s, Type: t, Message: m, Errors: errs}
}

// Error implements the error interface.
func (e *Error) Error() string {
	return fmt.Sprintf("error: status: %d type: %s message: %s", e.Status, e.Type, e.Message)
}

// Error implements the error interface.
func (e *MultiError) Error() string {
	result := ""
	for _, err := range e.Errors {
		result += fmt.Sprintf("%s\n", err.Error())
	}
	return result
}
