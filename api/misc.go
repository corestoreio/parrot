package api

import (
	"net/http"

	"github.com/anthonynsimon/parrot/render"
)

func ping(w http.ResponseWriter, r *http.Request) {
	render.JSON(w, http.StatusOK, map[string]interface{}{
		"status":  "200",
		"message": "Backend says hello.",
	})
}

func options(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(200)
}
