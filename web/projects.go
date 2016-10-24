package web

import (
	"net/http"

	"github.com/anthonynsimon/parrot/render"
)

func newProject(w http.ResponseWriter, r *http.Request) error {
	render.Template(w, "projects/new", nil)
	return nil
}

func createProject(w http.ResponseWriter, r *http.Request) error {
	render.Template(w, "projects/show", nil)
	return nil
}

func showProject(w http.ResponseWriter, r *http.Request) error {
	render.Template(w, "projects/show", nil)
	return nil
}
