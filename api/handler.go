package api

import (
	"net/http"

	"github.com/anthonynsimon/parrot/datastore"
	"github.com/gin-gonic/gin"
)

func Handler(ds datastore.Store) http.Handler {
	router := gin.Default()
	registerRoutes(router, ds)
	return router
}

func registerRoutes(r *gin.Engine, ds datastore.Store) {
	routes := []struct {
		path    string
		method  func(string, ...gin.HandlerFunc) gin.IRoutes
		handler func(datastore.Store, *gin.Context)
	}{
		{
			path:    "/documents",
			method:  r.POST,
			handler: CreateDocument,
		},
		{
			path:    "/documents/:id",
			method:  r.GET,
			handler: ShowDocument,
		},
		{
			path:    "/documents/:id",
			method:  r.PUT,
			handler: UpdateDocument,
		},
		{
			path:    "/documents/:id",
			method:  r.DELETE,
			handler: DeleteDocument,
		},
	}

	for _, route := range routes {
		route.method(route.path, injectEnv(route.handler, ds))
	}
}

func injectEnv(next func(datastore.Store, *gin.Context), ds datastore.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		next(ds, c)
	}
}
