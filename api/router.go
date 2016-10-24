package api

import (
	"net/http"

	"github.com/anthonynsimon/parrot/datastore"
	"github.com/anthonynsimon/parrot/paths"
	"github.com/pressly/chi"
)

var store datastore.Store
var signingKey []byte

func NewRouter(ds datastore.Store, sk []byte) http.Handler {
	store = ds
	signingKey = sk

	router := chi.NewRouter()
	registerRoutes(router)

	return router
}

func registerRoutes(router *chi.Mux) {
	router.Get(paths.PingPath, apiHandlerFunc(ping).ServeHTTP)
	router.Post(paths.RegisterPath, apiHandlerFunc(createUser).ServeHTTP)
	router.Post(paths.AuthenticatePath, apiHandlerFunc(authenticate).ServeHTTP)

	// router.Route(paths.UsersPath, func(pr chi.Router) {
	// 	pr.Use(tokenGate)
	// 	pr.Get("/:userID", apiHandlerFunc(showUser).ServeHTTP)
	// 	pr.Put("/:userID", apiHandlerFunc(updateUser).ServeHTTP)
	// 	pr.Delete("/:userID", apiHandlerFunc(deleteUser).ServeHTTP)
	// })

	router.Route(paths.ProjectsPath, func(pr chi.Router) {
		// Past this point, all routes require a valid token
		pr.Use(tokenGate)
		pr.Post("/", apiHandlerFunc(createProject).ServeHTTP)
		pr.Get("/:projectID", apiHandlerFunc(showProject).ServeHTTP)
		pr.Put("/:projectID", apiHandlerFunc(updateProject).ServeHTTP)
		pr.Delete("/:projectID", apiHandlerFunc(deleteProject).ServeHTTP)

		pr.Route("/:projectID"+paths.DocumentsPath, func(dr chi.Router) {
			dr.Post("/", apiHandlerFunc(createDocument).ServeHTTP)
			dr.Get("/", apiHandlerFunc(findDocuments).ServeHTTP)
			dr.Get("/:documentID", apiHandlerFunc(showDocument).ServeHTTP)
			dr.Put("/:documentID", apiHandlerFunc(updateDocument).ServeHTTP)
			dr.Delete("/:documentID", apiHandlerFunc(deleteDocument).ServeHTTP)
		})
	})
}
