// Package errors holds the datastore related errors.
package errors

import "errors"

var (
	ErrNoDB           = errors.New("couldn't get DB")
	ErrNotImplemented = errors.New("database not implemented")
	ErrNotFound       = errors.New("datastore: entry not found")
	ErrAlreadyExists  = errors.New("datastore: entry already exists")
)
