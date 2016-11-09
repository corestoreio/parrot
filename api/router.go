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

	router.Route("/projects", func(pr chi.Router) {
		// Past this point, all routes require a valid token
		pr.Use(handleToken)
		pr.Get("/", getUserProjects)
		pr.Post("/", createProject)

		pr.Route("/:projectID", func(dr chi.Router) {
			pr.Get("/", mustAuthorize(canViewProject, showProject))
			pr.Put("/", mustAuthorize(canUpdateProject, updateProject))
			pr.Delete("/", mustAuthorize(canDeleteProject, deleteProject))

			pr.Route("/users", func(dr chi.Router) {
				dr.Get("/", mustAuthorize(canViewProjectRoles, getProjectUsers))
				dr.Post("/", mustAuthorize(canAssignRoles, assignProjectUser))
				dr.Put("/:userID", mustAuthorize(canUpdateRoles, updateProjectUser))
				dr.Delete("/:userID", mustAuthorize(canRevokeRoles, revokeProjectUser))
			})

			pr.Route("/locales", func(dr chi.Router) {
				dr.Get("/", mustAuthorize(canViewLocales, findLocales))
				dr.Post("/", mustAuthorize(canCreateLocales, createLocale))
				dr.Get("/:localeID", mustAuthorize(canViewLocales, showLocale))
				dr.Put("/:localeID", mustAuthorize(canUpdateLocales, updateLocale))
				dr.Delete("/:localeID", mustAuthorize(canDeleteLocales, deleteLocale))
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
