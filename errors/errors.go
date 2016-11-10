package errors

import "fmt"

type Error struct {
	Status  int    `json:"status,omitempty"`
	Type    string `json:"type"`
	Message string `json:"message"`
}

func New(s int, t, m string) *Error {
	return &Error{Status: s, Type: t, Message: m}
}

type MultiError struct {
	Status  int     `json:"status,omitempty"`
	Type    string  `json:"type"`
	Message string  `json:"message"`
	Errors  []Error `json:"errors,omitempty"`
}

func NewMultiError(s int, t, m string, errs []Error) *MultiError {
	return &MultiError{Status: s, Type: t, Message: m, Errors: errs}
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
