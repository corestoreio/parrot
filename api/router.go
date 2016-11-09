package api

import (
	"net/http"

	"github.com/anthonynsimon/parrot/auth"
	"github.com/anthonynsimon/parrot/datastore"
	"github.com/anthonynsimon/parrot/render"
	"github.com/pressly/chi"
)

// TODO: inject store via closures instead of keeping global var
var store datastore.Store

func NewRouter(ds datastore.Store, authProvider auth.Provider) http.Handler {
	store = ds
	handleToken := tokenMiddleware(authProvider)

	router := chi.NewRouter()
	router.Use(cors)

	router.Get("/ping", ping)
	router.Post("/authenticate", authenticate(authProvider))

	router.Route("/users", func(dr chi.Router) {
		dr.Post("/", createUser)
	})

	router.Route("/projects", func(r1 chi.Router) {
		// Past this point, all routes require a valid token
		r1.Use(handleToken)
		r1.Get("/", getUserProjects)
		r1.Post("/", createProject)

		r1.Route("/:projectID", func(r2 chi.Router) {
			r2.Get("/", mustAuthorize(canViewProject, showProject))
			r2.Put("/", mustAuthorize(canUpdateProject, updateProject))
			r2.Delete("/", mustAuthorize(canDeleteProject, deleteProject))

			r2.Route("/users", func(r3 chi.Router) {
				r3.Get("/", mustAuthorize(canViewProjectRoles, getProjectUsers))
				r3.Post("/", mustAuthorize(canAssignRoles, assignProjectUser))
				r3.Put("/:userID", mustAuthorize(canUpdateRoles, updateProjectUser))
				r3.Delete("/:userID", mustAuthorize(canRevokeRoles, revokeProjectUser))
			})

			r2.Route("/locales", func(r3 chi.Router) {
				r3.Get("/", mustAuthorize(canViewLocales, findLocales))
				r3.Post("/", mustAuthorize(canCreateLocales, createLocale))
				r3.Get("/:localeID", mustAuthorize(canViewLocales, showLocale))
				r3.Put("/:localeID", mustAuthorize(canUpdateLocales, updateLocale))
				r3.Delete("/:localeID", mustAuthorize(canDeleteLocales, deleteLocale))
			})
		})
	})

	return router
}

func ping(w http.ResponseWriter, r *http.Request) {
	render.JSON(w, http.StatusOK, map[string]interface{}{
		"status":  "200",
		"message": "Parrot says hello.",
	})
}

func options(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(200)
}
