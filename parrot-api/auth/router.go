package auth

import (
	"net/http"

	"github.com/pressly/chi"
)

func NewRouter(ds AuthStore, tp TokenProvider) http.Handler {
	router := chi.NewRouter()

	router.Post("/token", IssueToken(tp, ds))

	return router
}
