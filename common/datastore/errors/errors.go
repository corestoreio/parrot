package errors

import "errors"

var (
	ErrNotFound      = errors.New("datastore: entry not found")
	ErrAlreadyExists = errors.New("datastore: entry already exists")
)
