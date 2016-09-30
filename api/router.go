package api

import (
	"github.com/anthonynsimon/parrot/api/auth"
	"github.com/anthonynsimon/parrot/datastore"
	"github.com/gorilla/mux"
	"github.com/urfave/negroni"
)

var store datastore.Store

func Register(m *mux.Router, ds datastore.Store, signingKey []byte) {
	store = ds
	auth.SigningKey = signingKey

	subRouter := mux.NewRouter().PathPrefix("/api").Subrouter().StrictSlash(true)
	registerRoutes(subRouter)

	chain := negroni.New(
		negroni.HandlerFunc(tokenGate),
		negroni.Wrap(subRouter),
	)

	m.PathPrefix("/api").Handler(chain)
}

func registerRoutes(r *mux.Router) {
	routes := []struct {
		path       string
		method     string
		handleFunc apiHandlerFunc
	}{
		{
			path:       AuthenticatePath,
			method:     "POST",
			handleFunc: authenticate,
		},
		{
			path:       ProjectsPath,
			method:     "POST",
			handleFunc: createProject,
		},
		{
			path:       ProjectsPath + "/{id:[0-9]+}",
			method:     "PUT",
			handleFunc: updateProject,
		},
		{
			path:       ProjectsPath + "/{id:[0-9]+}",
			method:     "GET",
			handleFunc: showProject,
		},
		{
			path:       ProjectsPath + "/{id:[0-9]+}",
			method:     "DELETE",
			handleFunc: deleteProject,
		},
		{
			path:       ProjectsPath + "/{projectID:[0-9]+}" + DocumentsPath,
			method:     "POST",
			handleFunc: createDocument,
		},
		{
			path:       ProjectsPath + "/{projectID:[0-9]+}" + DocumentsPath,
			method:     "GET",
			handleFunc: findDocuments,
		},
		{
			path:       ProjectsPath + "/{projectID:[0-9]+}" + DocumentsPath + "/{id:[0-9]+}",
			method:     "GET",
			handleFunc: showDocument,
		},
		{
			path:       ProjectsPath + "/{projectID:[0-9]+}" + DocumentsPath + "/{id:[0-9]+}",
			method:     "PUT",
			handleFunc: updateDocument,
		},
		{
			path:       ProjectsPath + "/{projectID:[0-9]+}" + DocumentsPath + "/{id:[0-9]+}",
			method:     "DELETE",
			handleFunc: deleteDocument,
		},
	}

	for _, route := range routes {
		r.Path(route.path).Handler(apiHandlerFunc(route.handleFunc)).Methods(route.method)
	}
}
