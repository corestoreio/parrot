// Package api handles the creation and configuration of all API resource routes.
package api

import (
	"net/http"

	"github.com/anthonynsimon/parrot/parrot-api/auth"
	"github.com/anthonynsimon/parrot/parrot-api/datastore"
	"github.com/pressly/chi"
)

// TODO: inject store via closures instead of keeping global var
var store datastore.Store

// NewRouter creates an API router based on the parameter datastore and token provider.
// It registers and configures all necessary routes.
func NewRouter(ds datastore.Store, tp auth.TokenProvider) http.Handler {
	store = ds
	mustHaveValidToken := tokenMiddleware(tp)

	router := chi.NewRouter()

	router.Use(enforceContentTypeJSON)

	router.Get("/ping", ping)
	router.Post("/users/register", createUser)

	router.Route("/users", func(r1 chi.Router) {
		// Past this point, all routes will require a valid token
		r1.Use(mustHaveValidToken)

		r1.Route("/self", func(r2 chi.Router) {
			r2.Get("/", getUserSelf)
			r2.Patch("/name", updateUserName)
			r2.Patch("/email", updateUserEmail)
			r2.Patch("/password", updateUserPassword)
		})
	})

	router.Route("/projects", func(r1 chi.Router) {
		// Past this point, all routes will require a valid token
		r1.Use(mustHaveValidToken)

		r1.Get("/", getUserProjects)
		r1.Post("/", createProject)

		r1.Route("/:projectID", func(r2 chi.Router) {
			r2.Get("/", mustAuthorize(canViewProject, showProject))
			r2.Delete("/", mustAuthorize(canDeleteProject, deleteProject))

			r2.Patch("/name", mustAuthorize(canUpdateProject, updateProjectName))

			r2.Post("/keys", mustAuthorize(canUpdateProject, addProjectKey))
			r2.Patch("/keys", mustAuthorize(canUpdateProject, updateProjectKey))
			r2.Delete("/keys/:keyName", mustAuthorize(canUpdateProject, deleteProjectKey))

			r2.Route("/users", func(r3 chi.Router) {
				r3.Get("/", mustAuthorize(canViewProjectRoles, getProjectUsers))
				r3.Post("/", mustAuthorize(canAssignProjectRoles, assignProjectUser))
				r3.Patch("/:userID/role", mustAuthorize(canUpdateProjectRoles, updateProjectUserRole))
				r3.Delete("/:userID", mustAuthorize(canRevokeProjectRoles, revokeProjectUser))
			})

			r2.Route("/clients", func(r3 chi.Router) {
				r3.Get("/", mustAuthorize(canManageAPIClients, getProjectClients))
				r3.Get("/:clientID", mustAuthorize(canManageAPIClients, getProjectClient))
				r3.Post("/", mustAuthorize(canManageAPIClients, createProjectClient))
				r3.Patch("/:clientID/resetSecret", mustAuthorize(canManageAPIClients, resetProjectClientSecret))
				r3.Patch("/:clientID/name", mustAuthorize(canManageAPIClients, updateProjectClientName))
				r3.Delete("/:clientID", mustAuthorize(canManageAPIClients, deleteProjectClient))
			})

			r2.Route("/locales", func(r3 chi.Router) {
				r3.Get("/", mustAuthorize(canViewLocales, findLocales))
				r3.Post("/", mustAuthorize(canCreateLocales, createLocale))

				r3.Route("/:localeIdent", func(r4 chi.Router) {
					r4.Get("/", mustAuthorize(canViewLocales, showLocale))
					r4.Patch("/pairs", mustAuthorize(canUpdateLocales, updateLocalePairs))
					r4.Delete("/", mustAuthorize(canDeleteLocales, deleteLocale))

					r4.Get("/export/:type", mustAuthorize(canExportLocales, exportLocale))
				})
			})
		})
	})

	return router
}
