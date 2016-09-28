package api

import (
	"net/http"

	"github.com/anthonynsimon/parrot/datastore"
	"github.com/anthonynsimon/parrot/middleware"
	"github.com/gorilla/mux"
)

var store datastore.Store

func Handler(ds datastore.Store) http.Handler {
	store = ds
	m := mux.NewRouter()
	registerRoutes(m)
	r := middleware.Log(middleware.ValidateAuthToken(m))
	return r
}

func registerRoutes(r *mux.Router) {
	routes := []struct {
		path    string
		method  string
		handler apiHandler
	}{
		{
			path:    "/projects",
			method:  "POST",
			handler: createProject,
		},
		{
			path:    "/projects/{id:[0-9]+}",
			method:  "GET",
			handler: showProject,
		},
		{
			path:    "/projects/{id:[0-9]+}",
			method:  "DELETE",
			handler: deleteProject,
		},
		{
			path:    "/projects/{projectID:[0-9]+}/documents",
			method:  "POST",
			handler: createDocument,
		},
		{
			path:    "/projects/{projectID:[0-9]+}/documents",
			method:  "GET",
			handler: findDocuments,
		},
		{
			path:    "/projects/{projectID:[0-9]+}/documents/{id:[0-9]+}",
			method:  "GET",
			handler: showDocument,
		},
		{
			path:    "/projects/{projectID:[0-9]+}/documents/{id:[0-9]+}",
			method:  "PUT",
			handler: updateDocument,
		},
		{
			path:    "/projects/{projectID:[0-9]+}/documents/{id:[0-9]+}",
			method:  "DELETE",
			handler: deleteDocument,
		},
	}

	for _, route := range routes {
		r.Handle(route.path, apiHandler(route.handler)).Methods(route.method)
	}
}
