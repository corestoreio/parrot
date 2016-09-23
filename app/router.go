package app

import (
	"net/http"

	"github.com/anthonynsimon/parrot/controllers"
	"github.com/anthonynsimon/parrot/datastore"
	"github.com/gin-gonic/gin"
)

func New(ds datastore.Store) http.Handler {
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
			handler: controllers.CreateDocument,
		},
		{
			path:    "/documents/:id",
			method:  r.GET,
			handler: controllers.ShowDocument,
		},
		{
			path:    "/documents/:id",
			method:  r.PUT,
			handler: controllers.UpdateDocument,
		},
		{
			path:    "/documents/:id",
			method:  r.DELETE,
			handler: controllers.DeleteDocument,
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
