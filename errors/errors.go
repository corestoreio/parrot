package errors

import "fmt"

var (
	ErrNotFound = New(404, "not found")
)

type ParrotError struct {
	Code    int
	Message string
}

func (e *ParrotError) Error() string {
	return fmt.Sprintf("error: %d %s", e.Code, e.Message)
}

func New(c int, m string) *ParrotError {
	return &ParrotError{Code: c, Message: m}
}
