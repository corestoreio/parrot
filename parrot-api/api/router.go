package api

import (
	"net/http"

	"github.com/anthonynsimon/parrot/common/datastore"
	"github.com/pressly/chi"
)

// TODO: inject store via closures instead of keeping global var
var store datastore.Store

func NewRouter(ds datastore.Store, tokenIntrospectionEndpoint string) http.Handler {
	store = ds
	handleToken := tokenMiddleware(tokenIntrospectionEndpoint)

	router := chi.NewRouter()
	// Enforce use of Content-Type header for POST, PUT and PATCH methods and validate it's JSON
	router.Use(
		recoverMiddleware,
		enforceContentTypeJSON,
	)

	router.Get("/ping", ping)
	router.Post("/auth/register", createUser)

	router.Route("/users", func(r1 chi.Router) {
		// Past this point, all routes will require a valid token
		r1.Use(handleToken)

		r1.Get("/self", getUserSelf)
	})

	router.Route("/projects", func(r1 chi.Router) {
		// Past this point, all routes will require a valid token
		r1.Use(handleToken)

		r1.Get("/", getUserProjects)
		r1.Post("/", createProject)

		r1.Route("/:projectID", func(r2 chi.Router) {
			r2.Get("/", mustAuthorize(CanViewProject, showProject))
			r2.Delete("/", mustAuthorize(CanDeleteProject, deleteProject))

			r2.Post("/keys", mustAuthorize(CanUpdateProject, addProjectKey))
			r2.Patch("/keys", mustAuthorize(CanUpdateProject, updateProjectKey))
			r2.Delete("/keys", mustAuthorize(CanUpdateProject, deleteProjectKey))

			r2.Route("/users", func(r3 chi.Router) {
				r3.Get("/", mustAuthorize(CanViewProjectRoles, getProjectUsers))
				r3.Post("/", mustAuthorize(CanAssignRoles, assignProjectUser))
				r3.Patch("/:userID/role", mustAuthorize(CanUpdateRoles, updateProjectUserRole))
				r3.Delete("/:userID", mustAuthorize(CanRevokeRoles, revokeProjectUser))
			})

			r2.Route("/clients", func(r3 chi.Router) {
				r3.Get("/", mustAuthorize(CanManageAPIClients, getProjectClients))
				r3.Get("/:clientID", mustAuthorize(CanManageAPIClients, getProjectClient))
				r3.Post("/", mustAuthorize(CanManageAPIClients, createProjectClient))
				r3.Patch("/:clientID/resetSecret", mustAuthorize(CanManageAPIClients, resetProjectClientSecret))
				r3.Patch("/:clientID/name", mustAuthorize(CanManageAPIClients, updateProjectClientName))
				r3.Delete("/:clientID", mustAuthorize(CanManageAPIClients, deleteProjectClient))
			})

			r2.Route("/locales", func(r3 chi.Router) {
				r3.Get("/", mustAuthorize(CanViewLocales, findLocales))
				r3.Post("/", mustAuthorize(CanCreateLocales, createLocale))

				r3.Route("/:localeIdent", func(r4 chi.Router) {
					r4.Get("/", mustAuthorize(CanViewLocales, showLocale))
					r4.Patch("/pairs", mustAuthorize(CanUpdateLocales, updateLocalePairs))
					r4.Delete("/", mustAuthorize(CanDeleteLocales, deleteLocale))
				})
			})
		})
	})

	return router
}
