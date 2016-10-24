package web

import (
	"net/http"

	"github.com/anthonynsimon/parrot/errors"
	"github.com/anthonynsimon/parrot/render"
)

type webHandlerFunc func(http.ResponseWriter, *http.Request) error

func (fn webHandlerFunc) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	err := fn(w, r)
	if err != nil {
		respErr := errors.ErrInternal
		if castedErr, ok := err.(*errors.Error); ok {
			respErr = castedErr
		}
		render.JSONError(w, respErr)
	}
}

func ping(w http.ResponseWriter, r *http.Request) error {
	_, err := w.Write([]byte("Frontend says hello."))
	return err
}
