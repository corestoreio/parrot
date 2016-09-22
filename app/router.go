package app

import (
	"net/http"

	"github.com/anthonynsimon/parrot/config"
	"github.com/anthonynsimon/parrot/controllers"
	"github.com/gin-gonic/gin"
)

func New(env *config.Env) http.Handler {
	router := gin.Default()
	registerRoutes(router, env)
	return router
}

func registerRoutes(r *gin.Engine, env *config.Env) {
	routes := []struct {
		path    string
		method  func(string, ...gin.HandlerFunc) gin.IRoutes
		handler func(*config.Env, *gin.Context)
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
		route.method(route.path, injectEnv(route.handler, env))
	}
}

func injectEnv(next func(*config.Env, *gin.Context), env *config.Env) gin.HandlerFunc {
	return func(c *gin.Context) {
		next(env, c)
	}
}
