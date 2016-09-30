package api

import (
	"net/http"

	"github.com/anthonynsimon/parrot/errors"
	"github.com/anthonynsimon/parrot/render"
)

type apiHandlerFunc func(http.ResponseWriter, *http.Request) error

func (fn apiHandlerFunc) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	err := fn(w, r)
	if err != nil {
		if err, ok := err.(*errors.Error); ok {
			render.JSONError(w, err)
			return
		}
		render.JSONError(w, errors.ErrInternal)
	}
}
