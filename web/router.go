package web

import (
	"github.com/anthonynsimon/parrot/datastore"
	"github.com/anthonynsimon/parrot/paths"
	"github.com/pressly/chi"
)

var store datastore.Store

func Register(router *chi.Mux, ds datastore.Store) {
	store = ds
	registerRoutes(router)
}

func registerRoutes(router *chi.Mux) {
	router.Get(paths.PingPath, webHandlerFunc(ping).ServeHTTP)
	router.Post(paths.RegisterPath, webHandlerFunc(createUser).ServeHTTP)

	// router.Route(api.ProjectsPath, func(pr chi.Router) {
	// 	// Past this point, all routes require a valid token
	// 	pr.Use(tokenGate)
	// 	pr.Post("/", webHandlerFunc(createProject).ServeHTTP)
	// 	pr.Get("/:projectID", webHandlerFunc(showProject).ServeHTTP)
	// 	pr.Put("/:projectID", webHandlerFunc(updateProject).ServeHTTP)
	// 	pr.Delete("/:projectID", webHandlerFunc(deleteProject).ServeHTTP)

	// 	pr.Route("/:projectID"+DocumentsPath, func(dr chi.Router) {
	// 		dr.Post("/", webHandlerFunc(createDocument).ServeHTTP)
	// 		dr.Get("/", webHandlerFunc(findDocuments).ServeHTTP)
	// 		dr.Get("/:documentID", webHandlerFunc(showDocument).ServeHTTP)
	// 		dr.Put("/:documentID", webHandlerFunc(updateDocument).ServeHTTP)
	// 		dr.Delete("/:documentID", webHandlerFunc(deleteDocument).ServeHTTP)
	// 	})
	// })
}
