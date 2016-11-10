package api

import (
	"net/http"

	"github.com/anthonynsimon/parrot/auth"
	"github.com/anthonynsimon/parrot/datastore"
	"github.com/pressly/chi"
)

// TODO: inject store via closures instead of keeping global var
var store datastore.Store

func NewRouter(ds datastore.Store, authProvider auth.Provider) http.Handler {
	store = ds
	handleToken := tokenMiddleware(authProvider)

	router := chi.NewRouter()
	// Enforce use of Content-Type header for POST, PUT and PATCH methods and validate it's JSON
	router.Use(
		enforceContentTypeJSON,
		cors,
	)

	router.Get("/ping", ping)
	router.Post("/authenticate", authenticate(authProvider))

	router.Route("/users", func(r1 chi.Router) {
		r1.Post("/", createUser)
	})

	router.Route("/projects", func(r1 chi.Router) {
		// Past this point, all routes require a valid token
		r1.Use(handleToken)
		r1.Get("/", getUserProjects)
		r1.Post("/", createProject)

		r1.Route("/:projectID", func(r2 chi.Router) {
			r2.Get("/", mustAuthorize(CanViewProject, showProject))
			r2.Patch("/keys", mustAuthorize(CanUpdateProject, updateProjectKeys))
			r2.Delete("/", mustAuthorize(CanDeleteProject, deleteProject))

			r2.Route("/roles", func(r3 chi.Router) {
				r3.Get("/", mustAuthorize(CanViewProjectRoles, getProjectUsers))
				r3.Post("/", mustAuthorize(CanAssignRoles, assignProjectUser))
				r3.Patch("/:userID/role", mustAuthorize(CanUpdateRoles, updateProjectUserRole))
				r3.Delete("/:userID", mustAuthorize(CanRevokeRoles, revokeProjectUser))
			})

			r2.Route("/locales", func(r3 chi.Router) {
				r3.Get("/", mustAuthorize(CanViewLocales, findLocales))
				r3.Post("/", mustAuthorize(CanCreateLocales, createLocale))

				r3.Route("/:localeID", func(r4 chi.Router) {
					r4.Get("/", mustAuthorize(CanViewLocales, showLocale))
					r4.Patch("/pairs", mustAuthorize(CanUpdateLocales, updateLocalePairs))
					r4.Delete("/", mustAuthorize(CanDeleteLocales, deleteLocale))
				})
			})
		})
	})

	return router
}
