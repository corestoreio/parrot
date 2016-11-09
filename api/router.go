package api

import (
	"net/http"

	"github.com/anthonynsimon/parrot/auth"
	"github.com/anthonynsimon/parrot/datastore"
	"github.com/anthonynsimon/parrot/paths"
	"github.com/pressly/chi"
)

// TODO: inject store via closures instead of keeping global var
var store datastore.Store

func NewRouter(ds datastore.Store, authProvider auth.Provider) http.Handler {
	store = ds
	handleToken := tokenMiddleware(authProvider)

	router := chi.NewRouter()
	router.Use(cors)

	router.Get(paths.PingPath, ping)
	router.Post(paths.AuthenticatePath, authenticate(authProvider))

	router.Route(paths.UsersPath, func(dr chi.Router) {
		dr.Post("/", createUser)
		dr.Route("/self", func(pr chi.Router) {
			pr.Get("/projects", getUserProjects)
		})
	})

	router.Route(paths.ProjectsPath, func(pr chi.Router) {
		// Past this point, all routes require a valid token
		pr.Use(handleToken)
		pr.Get("/", getUserProjects)
		pr.Post("/", createProject)
		pr.Get("/:projectID", mustAuthorize(canViewProject, showProject))
		pr.Put("/:projectID", mustAuthorize(canUpdateProject, updateProject))
		pr.Delete("/:projectID", mustAuthorize(canDeleteProject, deleteProject))

		pr.Route("/:projectID"+paths.UsersPath, func(dr chi.Router) {
			dr.Get("/", mustAuthorize(canViewProjectRoles, getProjectUsers))
			dr.Post("/", mustAuthorize(canAssignRoles, assignProjectUser))
			dr.Put("/:userID", mustAuthorize(canUpdateRoles, updateProjectUser))
			dr.Delete("/:userID", mustAuthorize(canRevokeRoles, revokeProjectUser))
		})

		pr.Route("/:projectID"+paths.LocalesPath, func(dr chi.Router) {
			dr.Post("/", mustAuthorize(canCreateLocales, createLocale))
			dr.Get("/", mustAuthorize(canViewLocales, findLocales))
			dr.Get("/:localeID", mustAuthorize(canViewLocales, showLocale))
			dr.Put("/:localeID", mustAuthorize(canUpdateLocales, updateLocale))
			dr.Delete("/:localeID", mustAuthorize(canDeleteLocales, deleteLocale))
		})
	})

	return router
}
