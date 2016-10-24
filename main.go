package main

import (
	"fmt"
	"html/template"
	"net/http"
	"os"
	"time"

	log "github.com/Sirupsen/logrus"
	"github.com/anthonynsimon/parrot/api"
	"github.com/anthonynsimon/parrot/datastore"
	"github.com/anthonynsimon/parrot/logger"
	"github.com/anthonynsimon/parrot/render"
	"github.com/anthonynsimon/parrot/web"
	"github.com/joho/godotenv"
	"github.com/pressly/chi"
	"github.com/pressly/chi/middleware"
)

func init() {
	// Config log
	log.SetFormatter(&log.TextFormatter{})
}

func main() {
	// init environment variables
	err := godotenv.Load()
	if err != nil {
		log.Fatal(err)
	}

	// init and ping datastore
	dbName := os.Getenv("DB")
	dbUrl := os.Getenv("DB_URL")

	ds, err := datastore.NewDatastore(dbName, dbUrl)
	if err != nil {
		log.Fatal(err)
	}

	defer ds.Close()
	if err = ds.Ping(); err != nil {
		log.Fatal(err)
	}

	// init routers
	mainRouter := chi.NewRouter()
	mainRouter.Use(logger.Request)
	mainRouter.Use(middleware.StripSlashes)

	// mainRouter.Use(logger.Request) // TODO convert to http.Handler
	apiRouter := api.NewRouter(ds, []byte(os.Getenv("API_SIGNING_KEY")))
	mainRouter.Mount("/api", apiRouter)

	// init and ping api backend
	apiUrl := os.Getenv("API_URL")
	backend, err := datastore.NewDatastore("apiClient", apiUrl)
	if err != nil {
		log.Fatal(err)
	}
	defer ds.Close()
	if err = ds.Ping(); err != nil {
		log.Fatal(err)
	}

	web.Register(mainRouter, backend)

	// parse view templates
	render.Templates = template.Must(template.ParseGlob("./views/**/*.html"))

	// config server
	addr := "localhost:8080"

	// init server
	s := &http.Server{
		Addr:           addr,
		Handler:        mainRouter,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	fmt.Println(fmt.Sprintf("Listening on %s", addr))

	log.Fatal(s.ListenAndServe())
}
