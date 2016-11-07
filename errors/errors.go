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
	Status  int
	Type    string
	Message string
}

func (e *Error) Error() string {
	return fmt.Sprintf("error: status: %d type: %s message: %s", e.Status, e.Type, e.Message)
}

func (e *Error) AsMap() map[string]interface{} {
	m := make(map[string]interface{})
	m["status"] = e.Status
	m["type"] = e.Type
	m["message"] = e.Message
	return m
}

func New(s int, t, m string) *Error {
	return &Error{Status: s, Type: t, Message: m}
}

func ErrorSliceToJSON(s []error) []map[string]interface{} {
	result := make([]map[string]interface{}, 0)
	for _, err := range s {
		casted := err.(*Error)
		result = append(result, casted.AsMap())
	}
	return result
}
