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

func loginForm(w http.ResponseWriter, r *http.Request) error {
	render.Template(w, "users/login", nil)
	return nil
}

func login(w http.ResponseWriter, r *http.Request) error {
	w.Header().Set("Authorization", "123")
	return nil
}
