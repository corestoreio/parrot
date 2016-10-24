package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	log "github.com/Sirupsen/logrus"
	"github.com/anthonynsimon/parrot/api"
	"github.com/anthonynsimon/parrot/datastore"
	"github.com/anthonynsimon/parrot/logger"
	"github.com/anthonynsimon/parrot/paths"
	"github.com/anthonynsimon/parrot/web"
	"github.com/joho/godotenv"
	"github.com/pressly/chi"
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

	// mainRouter.Use(logger.Request) // TODO convert to http.Handler
	apiRouter := api.NewRouter(ds, []byte(os.Getenv("API_SIGNING_KEY")))
	mainRouter.Mount("/api", apiRouter)

	// init and ping api backend
	hostName := os.Getenv("HOSTNAME")
	backend, err := datastore.NewDatastore("apiClient", hostName+paths.APIRootPath)
	if err != nil {
		log.Fatal(err)
	}
	defer ds.Close()
	if err = ds.Ping(); err != nil {
		log.Fatal(err)
	}

	web.Register(mainRouter, backend)

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

func initDatastore() (*datastore.Datastore, error) {
	name := os.Getenv("DB")
	url := os.Getenv("DB_URL")

	ds, err := datastore.NewDatastore(name, url)
	if err != nil {
		return nil, err
	}

	return ds, nil
}
