package web

import (
	"net/http"

	"github.com/anthonynsimon/parrot/render"
)

func newUser(w http.ResponseWriter, r *http.Request) error {
	render.Template(w, "users/new", nil)
	return nil
}

func createUser(w http.ResponseWriter, r *http.Request) error {
	render.Template(w, "users/show", nil)
	return nil
}

func showUser(w http.ResponseWriter, r *http.Request) error {
	render.Template(w, "users/show", nil)
	return nil
}
