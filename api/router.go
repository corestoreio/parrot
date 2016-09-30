package api

import (
	"net/http"

	"github.com/anthonynsimon/parrot/api/auth"
	"github.com/anthonynsimon/parrot/datastore"
	"github.com/pressly/chi"
)

var store datastore.Store

func NewRouter(ds datastore.Store, signingKey []byte) http.Handler {
	store = ds
	auth.SigningKey = signingKey

	router := chi.NewRouter()
	registerRoutes(router)

	return router
}

func registerRoutes(router *chi.Mux) {
	// router.Use(tokenGate)

	router.Post(AuthenticatePath, apiHandlerFunc(authenticate).ServeHTTP)

	router.Route(ProjectsPath, func(pr chi.Router) {
		pr.Use(tokenGate)
		pr.Post("/", apiHandlerFunc(createProject).ServeHTTP)
		pr.Get("/:projectID", apiHandlerFunc(showProject).ServeHTTP)
		pr.Put("/:projectID", apiHandlerFunc(updateProject).ServeHTTP)
		pr.Delete("/:projectID", apiHandlerFunc(deleteProject).ServeHTTP)

		pr.Route("/:projectID"+DocumentsPath, func(dr chi.Router) {
			dr.Post("/", apiHandlerFunc(createDocument).ServeHTTP)
			dr.Get("/", apiHandlerFunc(findDocuments).ServeHTTP)
			dr.Get("/:documentID", apiHandlerFunc(showDocument).ServeHTTP)
			dr.Put("/:documentID", apiHandlerFunc(updateDocument).ServeHTTP)
			dr.Delete("/:documentID", apiHandlerFunc(deleteDocument).ServeHTTP)
		})
	})
}
