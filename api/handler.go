package api

import (
	"net/http"

	"github.com/anthonynsimon/parrot/datastore"
	"github.com/gorilla/mux"
)

var store datastore.Store

func Handler(ds datastore.Store) http.Handler {
	store = ds
	r := mux.NewRouter()
	registerRoutes(r)
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
			handler: CreateProject,
		},
		{
			path:    "/projects/{id:[0-9]+}",
			method:  "GET",
			handler: ShowProject,
		},
		{
			path:    "/documents",
			method:  "POST",
			handler: CreateDocument,
		},
		{
			path:    "/documents/{id:[0-9]+}",
			method:  "GET",
			handler: ShowDocument,
		},
		{
			path:    "/documents/{id:[0-9]+}",
			method:  "PUT",
			handler: UpdateDocument,
		},
		{
			path:    "/documents/{id:[0-9]+}",
			method:  "DELETE",
			handler: DeleteDocument,
		},
	}

	for _, route := range routes {
		r.Handle(route.path, apiHandler(route.handler)).Methods(route.method)
	}
}
