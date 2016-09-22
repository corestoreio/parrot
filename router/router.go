package router

import (
	"net/http"

	"github.com/anthonynsimon/parrot/config"
	"github.com/anthonynsimon/parrot/controllers"
	"github.com/gorilla/mux"
	"github.com/urfave/negroni"
)

func New(env *config.Env) http.Handler {
	m := mux.NewRouter()

	// prepare and register routes
	registerRoutes(m, env)

	// build middleware handler
	n := &negroni.Negroni{}
	n.Use(negroni.NewRecovery())
	n.Use(negroni.NewLogger())

	// incorporate mutex and middleware
	n.UseHandler(m)

	return n
}

func registerRoutes(m *mux.Router, env *config.Env) {
	m.HandleFunc("/documents", injectEnv(controllers.CreateDocument, env)).Methods("POST")
	m.HandleFunc("/documents/{id}", injectEnv(controllers.ShowDocument, env)).Methods("GET")
}

func injectEnv(next func(*config.Env, http.ResponseWriter, *http.Request), env *config.Env) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		next(env, w, r)
	}
}
