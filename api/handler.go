package api

import (
	"net/http"

	"github.com/anthonynsimon/parrot/datastore"
	"github.com/gorilla/mux"
)

var store datastore.Store

func Handler(ds datastore.Store) http.Handler {
	store = ds
	m := mux.NewRouter()
	registerRoutes(m)
	// r := middleware.Log(middleware.TokenGate(m))
	return m
}

func registerRoutes(r *mux.Router) {
	routes := []struct {
		path       string
		method     string
		handleFunc http.HandlerFunc
	}{
		{
			path:       "/authenticate",
			method:     "POST",
			handleFunc: authenticate,
		},
		{
			path:       "/projects",
			method:     "POST",
			handleFunc: createProject,
		},
		{
			path:       "/projects/{id:[0-9]+}",
			method:     "GET",
			handleFunc: showProject,
		},
		{
			path:       "/projects/{id:[0-9]+}",
			method:     "DELETE",
			handleFunc: deleteProject,
		},
		{
			path:       "/projects/{projectID:[0-9]+}/documents",
			method:     "POST",
			handleFunc: createDocument,
		},
		{
			path:       "/projects/{projectID:[0-9]+}/documents",
			method:     "GET",
			handleFunc: findDocuments,
		},
		{
			path:       "/projects/{projectID:[0-9]+}/documents/{id:[0-9]+}",
			method:     "GET",
			handleFunc: showDocument,
		},
		{
			path:       "/projects/{projectID:[0-9]+}/documents/{id:[0-9]+}",
			method:     "PUT",
			handleFunc: updateDocument,
		},
		{
			path:       "/projects/{projectID:[0-9]+}/documents/{id:[0-9]+}",
			method:     "DELETE",
			handleFunc: deleteDocument,
		},
	}

	for _, route := range routes {
		r.Handle(route.path, route.handleFunc).Methods(route.method)
	}
}
