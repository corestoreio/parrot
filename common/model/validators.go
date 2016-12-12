package model

import (
	"regexp"

	"github.com/anthonynsimon/parrot/common/errors"
)

var (
	emailRegex *regexp.Regexp
)
var (
	ErrValidationFailure = &errors.Error{
		Type:    "ValidationFailure",
		Message: "data validation failed"}
)

func init() {
	emailRegex = regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$`)
}

func ValidEmail(str string) bool {
	return emailRegex.MatchString(str)
}

func HasMinLength(str string, min int) bool {
	return len(str) >= min
}

func NewValidationError(errs []errors.Error) error {
	return &errors.MultiError{
		Type:    ErrValidationFailure.Type,
		Message: ErrValidationFailure.Message,
		Errors:  errs}
}
