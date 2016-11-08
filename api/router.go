package api

import (
	"net/http"

	"github.com/anthonynsimon/parrot/api/auth"
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
		pr.Get("/:projectID", showProject)
		pr.Put("/:projectID", updateProject)
		pr.Delete("/:projectID", deleteProject)

		pr.Route("/:projectID"+paths.UsersPath, func(dr chi.Router) {
			dr.Get("/", getProjectUsers)
			dr.Post("/", assignProjectUser)
			dr.Post("/revoke", revokeProjectUser)
		})

		pr.Route("/:projectID"+paths.LocalesPath, func(dr chi.Router) {
			dr.Post("/", createLocale)
			dr.Get("/", findLocales)
			dr.Get("/:localeID", showLocale)
			dr.Put("/:localeID", updateLocale)
			dr.Delete("/:localeID", deleteLocale)
		})
	})

	return router
}
