package api

import (
	"net/http"

	"github.com/parrot-translate/parrot/parrot-api/render"
)

var (
	validContentTypes = []string{
		"application/json",
		"application/json; charset=utf-8"}
)

// isValidContentType returns true if the provided content type
// is an allowed one.
func isValidContentType(ct string) bool {
	if ct == "" {
		return false
	}
	for _, v := range validContentTypes {
		if ct == v {
			return true
		}
	}
	return false
}

// ping is an API endpoint for checking if the API is up.
func ping(w http.ResponseWriter, r *http.Request) {
	render.JSON(w, http.StatusOK, map[string]interface{}{
		"message": "Parrot says hello.",
	})
}
