package api

import (
	"net/http"

	"github.com/anthonynsimon/parrot/api/auth"
	"github.com/anthonynsimon/parrot/datastore"
	"github.com/pressly/chi"
	"github.com/urfave/negroni"
)

var store datastore.Store

func NewRouter(ds datastore.Store, signingKey []byte) http.Handler {
	store = ds
	auth.SigningKey = signingKey

	router := chi.NewRouter()
	registerRoutes(router)

	chain := negroni.New(
		negroni.HandlerFunc(tokenGate),
		negroni.Wrap(router),
	)

	return chain
}

func registerRoutes(r *chi.Mux) {
	routes := []struct {
		path       string
		method     func(string, http.HandlerFunc)
		handleFunc apiHandlerFunc
	}{
		{
			path:       AuthenticatePath,
			method:     r.Post,
			handleFunc: authenticate,
		},
		{
			path:       ProjectsPath,
			method:     r.Post,
			handleFunc: createProject,
		},
		{
			path:       ProjectsPath + "/:id",
			method:     r.Put,
			handleFunc: updateProject,
		},
		{
			path:       ProjectsPath + "/:id",
			method:     r.Get,
			handleFunc: showProject,
		},
		{
			path:       ProjectsPath + "/:id",
			method:     r.Delete,
			handleFunc: deleteProject,
		},
		{
			path:       ProjectsPath + "/:projectID" + DocumentsPath,
			method:     r.Post,
			handleFunc: createDocument,
		},
		{
			path:       ProjectsPath + "/:projectID" + DocumentsPath,
			method:     r.Get,
			handleFunc: findDocuments,
		},
		{
			path:       ProjectsPath + "/:projectID" + DocumentsPath + "/:id",
			method:     r.Get,
			handleFunc: showDocument,
		},
		{
			path:       ProjectsPath + "/:projectID" + DocumentsPath + "/:id",
			method:     r.Put,
			handleFunc: updateDocument,
		},
		{
			path:       ProjectsPath + "/:projectID" + DocumentsPath + "/:id",
			method:     r.Delete,
			handleFunc: deleteDocument,
		},
	}

	for _, route := range routes {
		route.method(route.path, apiHandlerFunc(route.handleFunc).ServeHTTP)
	}
}
