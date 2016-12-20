// Package auth handles the creation of an Auth Provider and its routes.
package auth

import (
	"net/http"

	"github.com/pressly/chi"
)

// NewRouter creates and configures all routes for the parameter authentication provider.
func NewRouter(ds AuthStore, tp TokenProvider) http.Handler {
	router := chi.NewRouter()

	router.Post("/token", IssueToken(tp, ds))

	return router
}
