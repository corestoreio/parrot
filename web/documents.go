package web

import (
	"net/http"

	"github.com/anthonynsimon/parrot/render"
)

func newDocument(w http.ResponseWriter, r *http.Request) error {
	render.Template(w, "documents/new", nil)
	return nil
}

func createDocument(w http.ResponseWriter, r *http.Request) error {
	render.Template(w, "documents/show", nil)
	return nil
}

func showDocument(w http.ResponseWriter, r *http.Request) error {
	render.Template(w, "documents/show", nil)
	return nil
}

func findDocuments(w http.ResponseWriter, r *http.Request) error {
	render.Template(w, "documents/find", nil)
	return nil
}
