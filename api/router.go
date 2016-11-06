package api

import (
	"net/http"

	"github.com/anthonynsimon/parrot/api/auth"
	"github.com/anthonynsimon/parrot/datastore"
	"github.com/anthonynsimon/parrot/paths"
	"github.com/pressly/chi"
)

var store datastore.Store

func NewRouter(ds datastore.Store, authProvider auth.Provider) http.Handler {
	store = ds
	tokenMiddleware := newTokenMiddleware(authProvider)

	router := chi.NewRouter()
	router.Use(cors)

	router.Get(paths.PingPath, apiHandlerFunc(ping).ServeHTTP)
	router.Post(paths.AuthenticatePath, apiHandlerFunc(authenticate(authProvider)).ServeHTTP)
	router.Post(paths.UsersPath, apiHandlerFunc(createUser).ServeHTTP)

	router.Route(paths.UsersPath, func(dr chi.Router) {
		dr.Route("/self", func(pr chi.Router) {

			pr.Get("/projects", apiHandlerFunc(getUserProjects).ServeHTTP)
		})
	})

	router.Route(paths.ProjectsPath, func(pr chi.Router) {
		// Past this point, all routes require a valid token
		pr.Use(tokenMiddleware)
		pr.Get("/", apiHandlerFunc(getUserProjects).ServeHTTP)
		pr.Post("/", apiHandlerFunc(createProject).ServeHTTP)
		pr.Get("/:projectID", apiHandlerFunc(showProject).ServeHTTP)
		pr.Put("/:projectID", apiHandlerFunc(updateProject).ServeHTTP)
		pr.Delete("/:projectID", apiHandlerFunc(deleteProject).ServeHTTP)

		pr.Route("/:projectID"+paths.UsersPath, func(dr chi.Router) {
			dr.Get("/", apiHandlerFunc(getProjectUsers).ServeHTTP)
			dr.Post("/", apiHandlerFunc(assignProjectUser).ServeHTTP)
			dr.Post("/revoke", apiHandlerFunc(revokeProjectUser).ServeHTTP)
		})

		pr.Route("/:projectID"+paths.LocalesPath, func(dr chi.Router) {
			dr.Post("/", apiHandlerFunc(createLocale).ServeHTTP)
			dr.Get("/", apiHandlerFunc(findLocales).ServeHTTP)
			dr.Get("/:localeID", apiHandlerFunc(showLocale).ServeHTTP)
			dr.Put("/:localeID", apiHandlerFunc(updateLocale).ServeHTTP)
			dr.Delete("/:localeID", apiHandlerFunc(deleteLocale).ServeHTTP)
		})
	})

	return router
}
