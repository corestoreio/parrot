package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	log "github.com/Sirupsen/logrus"
	"github.com/anthonynsimon/parrot/api"
	"github.com/anthonynsimon/parrot/datastore"
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
	ds, err := initDatastore()
	if err != nil {
		log.Fatal(err)
	}
	defer ds.Close()
	if err = ds.Ping(); err != nil {
		log.Fatal(err)
	}

	// init routers
	mainRouter := chi.NewRouter()
	// mainRouter.Use(logger.Request) // TODO convert to http.Handler
	apiRouter := api.NewRouter(ds, []byte(os.Getenv("API_SIGNING_KEY")))
	mainRouter.Mount("/api", apiRouter)

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
