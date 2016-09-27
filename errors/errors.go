package errors

import "fmt"

var (
	ErrNotFound = New(404, "not found")
)

type Error struct {
	Code    int
	Message string
}

func (e *Error) Error() string {
	return fmt.Sprintf("error: %d %s", e.Code, e.Message)
}

func New(c int, m string) *Error {
	return &Error{Code: c, Message: m}
}
